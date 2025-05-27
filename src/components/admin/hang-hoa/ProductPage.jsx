"use client";

import React, { useState, useLayoutEffect, useEffect } from "react";
import { Card, Button, Drawer, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProductHeader from "./ProductHeader";
import ProductActionBar from "./ProductActionBar";
import MobileSearchBar from "./mobile/MobileSearchBar";
import ProductFilters from "./ProductFilters";
import MobileMenu from "./mobile/MobileMenu";
import ProductTable from "./ProductTable";
import MobileProductList from "./mobile/MobileProductList";
import FilterDrawerContent from "./FilterDrawerContent";
import ModalManager from "./modal/ModalManager";

import {
  getProductsVariants,
  createProduct,
  updateProduct,
} from "@/requests/product";
import { getCategories } from "@/requests/category";
import { getAttributes } from "@/requests/attribute";
import { getUnits } from "@/requests/unit";

// Memoize các component để tối ưu performance
const MemoizedProductTable = React.memo(ProductTable);
const MemoizedMobileProductList = React.memo(MobileProductList);
const MemoizedProductFilters = React.memo(ProductFilters);

const ProductPage = () => {
  // Mobile và trạng thái drawer
  const [isMobile, setIsMobile] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // States cho product và bộ lọc
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0"); // "0" là tất cả danh mục
  const [selectedStatus, setSelectedStatus] = useState("0"); // "0" là tất cả trạng thái
  const [categories, setCategories] = useState([]); // Giả sử danh mục sẽ được load riêng
  const [units, setUnits] = useState([]); // Giả sử đơn vị sẽ được load riêng
  const [attributes, setAttributes] = useState([]); // Giả sử thuộc tính sẽ được load riêng
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoryResponse = await getCategories();
        setCategories(categoryResponse);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadAttributes() {
      try {
        const attributeResponse = await getAttributes();
        setAttributes(attributeResponse);
      } catch (error) {
        console.error("Lỗi khi lấy thuộc tính:", error);
      }
    }
    loadAttributes();
  }, []);

  useEffect(() => {
    async function loadUnits() {
      try {
        const unitResponse = await getUnits();
        setUnits(unitResponse);
      } catch (error) {
        console.error("Lỗi khi lấy đơn vị:", error);
      }
    }
    loadUnits();
  }, []);

  // Dummy handleScanCode (bạn có thể điều chỉnh lại theo logic thực tế)
  const handleScanCode = (code) => {
    setSearchText(code);
  };

  // Hàm fetch sản phẩm
  const fetchProducts = async ({
    search = "",
    page = 0,
    size = 20,
    category,
    productId,
    sort = "createdDate,desc",
  } = {}) => {
    try {
      setLoading(true);
      const params = { search, page, size, category, productId, sort };
      const response = await getProductsVariants(params);
      const mappedProducts = [];
      response.content.forEach((item) => {
        const parent = item.product;
        // Lưu trữ tên sản phẩm gốc
        const originName = parent.productName;
        // Nếu variant có attrValues, tạo tên variant theo định dạng: "Tên gốc (attr1, attr2)"
        let productName = originName;
        if (item.attrValues && item.attrValues.length > 0) {
          const attrs = item.attrValues
            .map((attr) => `${attr.attrName}: ${attr.attrValue}`)
            .join(", ");
          productName = `${originName} (${attrs})`;
        }
        mappedProducts.push({
          id: item.id,
          originName, // Sản phẩm gốc
          name: productName, // Tên variant đã nối attrValues nếu có
          description: parent.description,
          category:
            parent.category && Array.isArray(parent.category)
              ? parent.category.map((c) => c.categoryName).join(", ")
              : "",
          price: item.price,
          costPrice: item.costPrice,
          quantity: item.quantity,
          sku: item.sku,
          barcode: item.barcode,
          expiryDate: item.expiryDate,
          image: parent.image || "../../../haohao.png",
          attrValues: item.attrValues,
          createdDate: item.createdDate,
          lastModifiedDate: item.lastModifiedDate,
          status: item.status,
        });
      });
      // Cập nhật pagination dựa trên giá trị trả về từ API
      setPagination({
        current: page + 1,
        pageSize: size,
        total: response.totalElements,
      });
      // Luôn cập nhật dataSource bằng dữ liệu mới (không nối thêm dữ liệu cũ)
      setProducts(mappedProducts);
    } catch (e) {
      console.log("Lỗi khi tìm kiếm sản phẩm:", e);
    } finally {
      setLoading(false);
    }
  };

  // Khi component mount, fetch dữ liệu trang đầu tiên
  useEffect(() => {
    fetchProducts({ page: 0, size: pagination.pageSize });
  }, []);

  // Kiểm tra kích thước màn hình
  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Props cho bộ lọc
  const filterProps = {
    searchText,
    setSearchText,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    categories,
    isMobile,
  };

  // Xử lý thay đổi bảng: pagination, lọc, sắp xếp, ...
  const handleTableChange = (newPagination, filters, sorter) => {
    const { current, pageSize } = newPagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    // Nếu có sorter, truyền theo định dạng ?sort=field,order (order: asc hoặc desc)
    const sortParam = sorter.field
      ? `${sorter.field},${sorter.order === "ascend" ? "asc" : "desc"}`
      : undefined;
    fetchProducts({
      search: searchText,
      page: current - 1,
      size: pageSize,
      category: selectedCategory,
      sort: sortParam,
    });
  };

  // Các hàm dummy cho hành động modal (thêm, sửa, xóa, import)
  const handleAddProduct = async (payload) => {
    try {
      setLoading(true);
      // Tạo một promise timeout 10 giây
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000),
      );
      // Đợi tạo sản phẩm hoặc timeout
      const response = await Promise.race([
        createProduct(payload),
        timeoutPromise,
      ]);
      if (!response || response.error) {
        throw new Error(response?.error || "API error");
      }
      message.success("Thêm sản phẩm thành công");
      setAddModalVisible(false);
      // Refresh product list after adding
      fetchProducts({ page: 0, size: pagination.pageSize });
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      message.error("Thêm sản phẩm thất bại. Vui lòng kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  };
  const handleEditProduct = async (id, data) => {
    try {
      setLoading(true);
      // Tạo một promise timeout 10 giây
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000),
      );
      const response = await Promise.race([
        updateProduct(id, data),
        timeoutPromise,
      ]);
      if (!response || response.error) {
        throw new Error(response?.error || "API error");
      }
      message.success("Cập nhật sản phẩm thành công");
      setEditModalVisible(false);
      // Refresh product list after editing
      fetchProducts({ page: 0, size: pagination.pageSize });
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      message.error(
        "Cập nhật sản phẩm thất bại. Vui lòng kiểm tra lại thông tin!",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProduct = () => {};
  const handleImportProducts = () => {};

  // Định nghĩa hàm reloadCategories để tải lại danh mục từ API
  const reloadCategories = async () => {
    try {
      const categoryResponse = await getCategories();
      setCategories(categoryResponse);
    } catch (error) {
      console.error("Lỗi khi tải lại danh mục:", error);
    }
  };

  const reloadAttributes = async () => {
    try {
      const attributeResponse = await getAttributes();
      setAttributes(attributeResponse);
    } catch (error) {
      console.error("Lỗi khi tải lại thuộc tính:", error);
    }
  };

  const reloadUnits = async () => {
    try {
      const unitResponse = await getUnits();
      setUnits(unitResponse);
    } catch (error) {
      console.error("Lỗi khi tải lại đơn vị:", error);
    }
  };

  return (
    <div>
      <Card className="transition-shadow h-fit-screen">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Page header */}
          <ProductHeader
            isMobile={isMobile}
            setMenuDrawerOpen={setMenuDrawerOpen}
            setFilterDrawerOpen={setFilterDrawerOpen}
            onRefresh={() =>
              fetchProducts({ page: 0, size: pagination.pageSize })
            }
          />

          {/* Action bar - Desktop */}
          {!isMobile && (
            <ProductActionBar
              setAddModalVisible={setAddModalVisible}
              setImportModalVisible={setImportModalVisible}
              ProductFilters={MemoizedProductFilters}
              filterProps={filterProps}
              loading={loading}
              onRefresh={() =>
                fetchProducts({ page: 0, size: pagination.pageSize })
              }
            />
          )}

          {/* Product Table for Desktop */}
          {!isMobile && (
            <MemoizedProductTable
              products={products}
              loading={loading}
              pagination={pagination}
              handleTableChange={handleTableChange}
              setSelectedProduct={setSelectedProduct}
              setViewModalVisible={setViewModalVisible}
              setEditModalVisible={setEditModalVisible}
              setDeleteModalVisible={setDeleteModalVisible}
            />
          )}

          {/* Mobile search bar */}
          {isMobile && (
            <MobileSearchBar
              searchText={searchText}
              updateSearchText={setSearchText}
              handleScanCode={handleScanCode}
            />
          )}

          {/* Product List for Mobile */}
          {isMobile && (
            <MemoizedMobileProductList
              products={products}
              loading={loading}
              pagination={pagination}
              setSelectedProduct={setSelectedProduct}
              setViewModalVisible={setViewModalVisible}
              setEditModalVisible={setEditModalVisible}
              setDeleteModalVisible={setDeleteModalVisible}
            />
          )}
        </div>
      </Card>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        open={menuDrawerOpen}
        onClose={() => setMenuDrawerOpen(false)}
        width={280}
      >
        <MobileMenu
          setAddModalVisible={setAddModalVisible}
          setImportModalVisible={setImportModalVisible}
        />
      </Drawer>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Bộ lọc"
        placement="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        width={300}
      >
        <FilterDrawerContent
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          categories={categories}
          setFilterDrawerOpen={setFilterDrawerOpen}
        />
      </Drawer>

      {/* Modal Manager */}
      <ModalManager
        addModalVisible={addModalVisible}
        editModalVisible={editModalVisible}
        viewModalVisible={viewModalVisible}
        deleteModalVisible={deleteModalVisible}
        importModalVisible={importModalVisible}
        setAddModalVisible={setAddModalVisible}
        setEditModalVisible={setEditModalVisible}
        setViewModalVisible={setViewModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        setImportModalVisible={setImportModalVisible}
        selectedProduct={selectedProduct}
        handleAddProduct={handleAddProduct}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
        handleImportProducts={handleImportProducts}
        categories={categories}
        reloadCategories={reloadCategories}
        attributes={attributes}
        reloadAttributes={reloadAttributes}
        units={units}
        reloadUnits={reloadUnits}
        isMobile={isMobile}
      />

      {/* Floating action button cho mobile */}
      <Button
        type="primary"
        shape="circle"
        onClick={() => setAddModalVisible(true)}
        icon={<PlusOutlined />}
        style={{
          zIndex: 2,
          position: "fixed",
          bottom: "80px",
          width: "48px",
          height: "48px",
          display: isMobile ? "block" : "none",
        }}
        className="right-4 shadow-sm"
      />
    </div>
  );
};

export default ProductPage;
