"use client";

import React, { useState, useLayoutEffect, useEffect } from "react";
import { Card, Drawer, message, Spin } from "antd";
import ProductHeader from "./ProductHeader";
import ProductActionBar from "./ProductActionBar";
import MobileSearchBar from "./mobile/MobileSearchBar";
import ProductFilters from "./ProductFilters";
import MobileMenu from "./mobile/MobileMenu";
import ProductTable from "./ProductTable";
import MobileProductList from "./mobile/MobileProductList";
import FilterDrawerContent from "./FilterDrawerContent";
import ModalManager from "./modal/ModalManager";
import FloatingActionButton from "./mobile/FloatingActionButton";

import {
  getProductsWithVariants,
  getProductsVariants,
  createProduct,
  updateProduct,
  updateProductStatus,
  createVariant,
  updateVariant,
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
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [viewProductModalVisible, setViewProductModalVisible] = useState(false);
  const [addVariantModalVisible, setAddVariantModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [viewVariantModalVisible, setViewVariantModalVisible] = useState(false);
  const [editProductModalVisible, setEditProductModalVisible] = useState(false);
  const [editVariantModalVisible, setEditVariantModalVisible] = useState(false);

  // States cho product và bộ lọc
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0"); // "0" là tất cả danh mục
  const [selectedStatus, setSelectedStatus] = useState("0"); // "0" là tất cả trạng thái
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
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

  const handleRefresh = () => {
    fetchProducts({ page: 0, size: pagination.pageSize });
  };

  const handleScanCode = (code) => {
    setSearchText(code);
  };

  function mapProductsFromApi(data) {
    return data.map((item) => {
      const { product, variants } = item;
      return {
        key: product.productId,
        productId: product.productId,
        productName: product.productName,
        description: product.description,
        status: product.status,
        categoryList: Array.isArray(product.categoryList)
          ? product.categoryList.map((c) => c.categoryName).join(", ")
          : "",
        variants: (variants || []).map((v) => ({
          ...v,
          name:
            v.attrValues && v.attrValues.length
              ? `${v.attrValues.map((a) => `${a.attrName}: ${a.attrValue}`).join(", ")}`
              : "",
        })),
        variantsCount: variants ? variants.length : 0,
        quantity:
          variants && variants.length > 0
            ? variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
            : 0,
        image:
          variants &&
          variants[0] &&
          variants[0].imagePaths &&
          variants[0].imagePaths.length > 0
            ? variants[0].imagePaths[0]
            : null,
      };
    });
  }

  const fetchProducts = async ({
    search = "",
    page = 0,
    size = 10,
    category,
    status,
    sort = "lastModifiedDate,desc",
  } = {}) => {
    setLoading(true);
    const minDelay = 500;
    const startTime = Date.now();
    try {
      const filterCriteria = {};
      if (category && category !== "0") {
        filterCriteria.categoryId = category;
      }
      if (status && status !== "0") {
        filterCriteria.status = status.toUpperCase();
      }
      const searchParam = search.trim();
      const params = {
        search: searchParam,
        sort,
        filter: filterCriteria, // truyền filter theo danh mục (hoặc các tiêu chí khác nếu cần)
        pageNumber: page, // BE đòi dạng 0-index
        pageSize: size,
      };
      const response = await getProductsWithVariants(params);
      const mappedProducts = mapProductsFromApi(response.content || []);
      setProducts(mappedProducts);
      setPagination({
        current: page + 1,
        pageSize: size,
        total: response.totalElements,
      });
    } catch (e) {
      console.log("Lỗi khi tìm kiếm sản phẩm:", e);
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  const handleSearch = (searchTerm) => {
    setSearchText(searchTerm);
    fetchProducts({
      search: searchTerm,
      page: 0,
      size: pagination.pageSize,
      category: selectedCategory,
      status: selectedStatus,
      sort: "lastModifiedDate,desc",
    });
  };

  useEffect(() => {
    handleSearch(searchText);
  }, [selectedCategory, selectedStatus]);

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
    onSearch: handleSearch,
  };

  const handleAddProduct = async (payload) => {
    try {
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

      handleRefresh();
      message.success("Thêm sản phẩm thành công");
      setAddProductModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      message.error("Thêm sản phẩm thất bại. Vui lòng kiểm tra lại thông tin!");
    } finally {
    }
  };
  const handleEditProduct = async (id, data) => {
    try {
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

      handleRefresh();
      setEditProductModalVisible(false);
      message.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      message.error(
        "Cập nhật sản phẩm thất bại. Vui lòng kiểm tra lại thông tin!",
      );
    }
  };
  const handleAddVariant = async (productId, variantData) => {
    try {
      const response = await createVariant(productId, variantData);
      if (!response || response.error) {
        throw new Error(response?.error || "API error");
      }
      handleRefresh();
      message.success("Thêm biến thể thành công");
      setAddVariantModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi thêm biến thể:", error);
      message.error("Thêm biến thể thất bại. Vui lòng kiểm tra lại thông tin!");
    }
  };
  const handleUpdateProductStatus = async (id, data) => {
    try {
      // Tạo một promise timeout 10 giây
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000),
      );
      const response = await Promise.race([
        updateProductStatus(id, data),
        timeoutPromise,
      ]);
      if (!response || response.error) {
        throw new Error(response?.error || "API error");
      }

      handleRefresh();
      message.success("Cập nhật trạng thái sản phẩm thành công");
      setEditProductModalVisible(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
      message.error(
        "Cập nhật trạng thái sản phẩm thất bại. Vui lòng kiểm tra lại thông tin!",
      );
    }
  };
  const handleImportProducts = () => {};

  const handleEditProductVariant = async (id, data) => {
    try {
      // Tạo một promise timeout 10 giây
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000),
      );
      const response = await Promise.race([
        updateVariant(id, data),
        timeoutPromise,
      ]);
      if (!response || response?.data?.error) {
        throw new Error(response?.data?.error || "API error");
      } else {
        handleRefresh();
        message.success("Cập nhật biến thể sản phẩm thành công");
        setEditVariantModalVisible(false);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật biến thể sản phẩm:", error);
      message.error(
        "Cập nhật biến thể sản phẩm thất bại. Vui lòng kiểm tra lại thông tin!",
      );
    }
  };

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
            onRefresh={handleRefresh}
          />

          {/* Action bar - Desktop */}
          {!isMobile && (
            <ProductActionBar
              setAddProductModalVisible={setAddProductModalVisible}
              setImportModalVisible={setImportModalVisible}
              ProductFilters={MemoizedProductFilters}
              filterProps={filterProps}
              loading={loading}
              onRefresh={handleRefresh}
            />
          )}

          {/* Product Table for Desktop */}
          {!isMobile && (
            <Spin spinning={loading}>
              <MemoizedProductTable
                products={products}
                loading={loading}
                pagination={pagination}
                handleTableChange={handleTableChange}
                setSelectedProductId={setSelectedProductId}
                setSelectedVariantId={setSelectedVariantId}
                setViewProductModalVisible={setViewProductModalVisible}
                setEditProductModalVisible={setEditProductModalVisible}
                setAddVariantModalVisible={setAddVariantModalVisible}
                setViewVariantModalVisible={setViewVariantModalVisible}
                setEditVariantModalVisible={setEditVariantModalVisible}
                handleUpdateProductStatus={handleUpdateProductStatus}
              />
            </Spin>
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
            <Spin spinning={loading}>
              <MemoizedMobileProductList
                products={products}
                loading={loading}
                pagination={pagination}
                setSelectedProductId={setSelectedProductId}
                setSelectedVariantId={setSelectedVariantId}
                setViewProductModalVisible={setViewProductModalVisible}
                setEditProductModalVisible={setEditProductModalVisible}
                setAddVariantModalVisible={setAddVariantModalVisible}
              />
            </Spin>
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
          setAddProductModalVisible={setAddProductModalVisible}
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
        addProductModalVisible={addProductModalVisible}
        editProductModalVisible={editProductModalVisible}
        viewProductModalVisible={viewProductModalVisible}
        addVariantModalVisible={addVariantModalVisible}
        importModalVisible={importModalVisible}
        setAddProductModalVisible={setAddProductModalVisible}
        setEditProductModalVisible={setEditProductModalVisible}
        setViewProductModalVisible={setViewProductModalVisible}
        setAddVariantModalVisible={setAddVariantModalVisible}
        setImportModalVisible={setImportModalVisible}
        selectedProductId={selectedProductId}
        selectedVariantId={selectedVariantId}
        handleAddProduct={handleAddProduct}
        handleEditProduct={handleEditProduct}
        handleAddVariant={handleAddVariant}
        handleUpdateProductStatus={handleUpdateProductStatus}
        handleImportProducts={handleImportProducts}
        categories={categories}
        reloadCategories={reloadCategories}
        attributes={attributes}
        reloadAttributes={reloadAttributes}
        units={units}
        reloadUnits={reloadUnits}
        isMobile={isMobile}
        viewVariantModalVisible={viewVariantModalVisible}
        setViewVariantModalVisible={setViewVariantModalVisible}
        editVariantModalVisible={editVariantModalVisible}
        setEditVariantModalVisible={setEditVariantModalVisible}
        handleEditProductVariant={handleEditProductVariant}
      />

      <FloatingActionButton
        setAddProductModalVisible={setAddProductModalVisible}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ProductPage;
