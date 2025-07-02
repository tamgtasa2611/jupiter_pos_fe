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
    onSearch,
    onLoadMore,
    loading,
    setLoading,
    initLoading,
    outOfProducts,
    setOutOfProducts,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
  }) => {
    const [loadingMore, setLoadingMore] = useState(false);

    const handleSearch = async (searchValue) => {
      const trimmedValue = searchValue.trim();
      setSearchQuery(trimmedValue);

      setCurrentPage(0);
      await onSearch({ search: trimmedValue, page: 0, size: 30 });
    };

    const handleLoadMore = async () => {
      const nextPage = currentPage + 1;
      setLoadingMore(true);
      try {
        await onLoadMore({ page: nextPage, size: 20, search: searchQuery });
        setCurrentPage(nextPage);
      } catch (error) {
        console.error("Lỗi khi load thêm sản phẩm:", error);
      } finally {
        setLoadingMore(false);
      }
    };

    return (
      <Card
        className="h-full w-full"
        styles={{
          body: {
            height: "100%",
            padding: 16,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Flex vertical gap={16} className="h-full">
          <SearchBar onSearch={handleSearch} loading={loading} />
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
                products={products}
                onProductClick={onProductClick}
                loading={loading}
                loadingMore={loadingMore}
                handleLoadMore={handleLoadMore}
                isInitial={initLoading} // Ẩn nút khi là lần load đầu
                outOfProducts={outOfProducts}
                setOutOfProducts={setOutOfProducts}
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
