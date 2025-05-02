"use client";

import React, { useState, useLayoutEffect } from "react";
import { Card, Button, Drawer, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProductTable from "./ProductTable";
import ProductList from "./ProductList";
import ProductFilters from "./ProductFilters";
import MobileMenu from "./MobileMenu";

// Import custom hooks
import useProductData from "@hooks/hang-hoa/useProductData";
import useBarcodeScan from "@hooks/hang-hoa/useBarcodeScan";

// Import components
import ProductHeader from "./ProductHeader";
import ProductActionBar from "./ProductActionBar";
import MobileSearchBar from "./MobileSearchBar";
import FilterDrawerContent from "./FilterDrawerContent";
import ModalManager from "./ModalManager";

// Memoize ProductTable, ProductList, and ProductFilters for performance
const MemoizedProductTable = React.memo(ProductTable);
const MemoizedProductList = React.memo(ProductList);
const MemoizedProductFilters = React.memo(ProductFilters);

const ProductPage = () => {
  // Mobile and drawer states
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

  // Custom hooks
  const productData = useProductData();
  const { handleScanCode } = useBarcodeScan(productData.setSearchText);

  // Check for mobile screen
  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Filter props for ProductFilters component
  const filterProps = {
    searchText: productData.searchText,
    setSearchText: productData.updateSearchText,
    selectedCategory: productData.selectedCategory,
    setSelectedCategory: productData.setSelectedCategory,
    selectedStatus: productData.selectedStatus,
    setSelectedStatus: productData.setSelectedStatus,
    categories: productData.categories,
    isMobile,
  };

  return (
    <div>
      <Card className="transition-shadow h-fit-screen">
        <Flex vertical gap={16}>
          {/* Page header */}
          <ProductHeader
            isMobile={isMobile}
            setMenuDrawerOpen={setMenuDrawerOpen}
            setFilterDrawerOpen={setFilterDrawerOpen}
          />

          {/* Action bar - Desktop */}
          {!isMobile && (
            <ProductActionBar
              setAddModalVisible={setAddModalVisible}
              setImportModalVisible={setImportModalVisible}
              ProductFilters={MemoizedProductFilters}
              filterProps={filterProps}
            />
          )}

          {/* Product Table for Desktop */}
          {!isMobile && (
            <MemoizedProductTable
              products={productData.products}
              loading={productData.loading}
              pagination={productData.pagination}
              handleTableChange={productData.handleTableChange}
              setSelectedProduct={setSelectedProduct}
              setViewModalVisible={setViewModalVisible}
              setEditModalVisible={setEditModalVisible}
              setDeleteModalVisible={setDeleteModalVisible}
            />
          )}

          {/* Mobile search bar */}
          {isMobile && (
            <MobileSearchBar
              searchText={productData.searchText}
              updateSearchText={productData.updateSearchText}
              handleScanCode={handleScanCode}
            />
          )}

          {/* Product List for Mobile */}
          {isMobile && (
            <MemoizedProductList
              products={productData.products}
              loading={productData.loading}
              pagination={productData.pagination}
              setSelectedProduct={setSelectedProduct}
              setViewModalVisible={setViewModalVisible}
              setEditModalVisible={setEditModalVisible}
              setDeleteModalVisible={setDeleteModalVisible}
            />
          )}
        </Flex>
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
          selectedCategory={productData.selectedCategory}
          setSelectedCategory={productData.setSelectedCategory}
          selectedStatus={productData.selectedStatus}
          setSelectedStatus={productData.setSelectedStatus}
          categories={productData.categories}
          setFilterDrawerOpen={setFilterDrawerOpen}
        />
      </Drawer>

      {/* All modals */}
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
        handleAddProduct={productData.handleAddProduct}
        handleEditProduct={productData.handleEditProduct}
        handleDeleteProduct={productData.handleDeleteProduct}
        handleImportProducts={productData.handleImportProducts}
        categories={productData.categories}
        isMobile={isMobile}
      />

      {/* Floating action button for mobile */}
      <Button
        type="primary"
        shape="circle"
        onClick={() => setAddModalVisible(true)}
        icon={<PlusOutlined />}
        className="right-4 shadow-sm"
        style={{
          zIndex: 2,
          position: "fixed",
          bottom: "80px",
          width: "48px",
          height: "48px",
          display: isMobile ? "block" : "none",
        }}
      ></Button>
    </div>
  );
};

export default ProductPage;
