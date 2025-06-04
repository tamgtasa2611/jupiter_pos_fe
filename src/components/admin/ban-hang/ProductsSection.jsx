import React, { useState, memo, useRef, useEffect, useMemo } from "react";
import { Card, Button, Spin, Flex } from "antd";
import SearchBar from "./SearchBar";
import CategorySelector from "./CategorySelector";
import ProductGrid from "./ProductGrid";

const ProductsSection = memo(
  ({
    categories,
    products,
    selectedCategory,
    onSelectCategory,
    onProductClick,
    onSearch, // onSearch callback receives { page, size, search }
    loading,
    setLoading,
    initLoading, // Initial loading state for the first load
  }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const handleSearch = async (searchValue) => {
      const trimmedValue = searchValue.trim();
      // Call your API to search variants only when the user has pressed Enter
      await onSearch({ search: trimmedValue, page: 0, size: 30 });
    };

    // Load more products when button "Load More" is clicked.
    const handleLoadMore = async () => {
      const nextPage = currentPage + 1;
      setLoadingMore(true);
      try {
        await onSearch({ page: nextPage, size: 15, search: searchQuery });
        setCurrentPage(nextPage);
      } catch (error) {
        console.error("Lỗi load thêm sản phẩm:", error);
      } finally {
        setLoadingMore(false);
      }
    };

    // Filter products by category and search text for immediate UI display.
    const filteredProducts = useMemo(() => {
      return Array.isArray(products)
        ? products.filter(
            (product) =>
              (selectedCategory === "all" ||
                product.category === selectedCategory) &&
              product.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : [];
    }, [products, selectedCategory, searchQuery]);

    return (
      <Card
        className="h-full w-full"
        bodyStyle={{
          height: "100%",
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Flex vertical gap={16} className="h-full">
          <SearchBar onSearch={handleSearch} />
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              overflowX: "hidden",
              position: "relative",
            }}
          >
            {loading && initLoading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                onProductClick={onProductClick}
                loading={loading}
                loadingMore={loadingMore}
                handleLoadMore={handleLoadMore}
                isInitial={initLoading} // Ẩn nút khi là lần load đầu
              />
            )}
          </div>
        </Flex>
      </Card>
    );
  },
);

ProductsSection.displayName = "ProductsSection";

export default ProductsSection;
