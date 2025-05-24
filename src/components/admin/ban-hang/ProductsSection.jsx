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
  }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // When searching from the SearchBar, reset page and load the first page.
    const handleSearch = async (value) => {
      const trimmedValue = value.trim();
      setSearchQuery(trimmedValue);
      setCurrentPage(0);
      setLoadingProducts(true);
      await onSearch({ page: 0, size: 5, search: trimmedValue });
      setLoadingProducts(false);
    };

    // Load more products when button "Load More" is clicked.
    const handleLoadMore = async () => {
      const nextPage = currentPage + 1;
      setLoadingMore(true);
      try {
        await onSearch({ page: nextPage, size: 10, search: searchQuery });
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
            {loadingProducts ? (
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
                loadingMore={loadingMore}
                handleLoadMore={handleLoadMore}
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
