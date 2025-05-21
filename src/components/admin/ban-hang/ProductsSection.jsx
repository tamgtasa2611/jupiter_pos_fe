import React, { useState, memo } from "react";
import { Card, Flex } from "antd";
import SearchBar from "./SearchBar";
import CategorySelector from "./CategorySelector";
import ProductGrid from "./ProductGrid";
import { getProducts } from "@/requests/product";

const ProductsSection = memo(
  ({
    categories,
    products,
    selectedCategory,
    onSelectCategory,
    onProductClick,
    onSearch,
  }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = async (value) => {
      setSearchQuery(value);
      // onSearch(value);
      onSearch({ page: 0, size: 5 });
    };

    // Chỉ lọc khi cần thiết để tăng hiệu suất
    const filteredProducts = Array.isArray(products)
      ? products.filter(
          (product) =>
            (selectedCategory === "all" ||
              product.category === selectedCategory) &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [];

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

          <div className="flex-grow overflow-y-auto overflow-x-hidden">
            <ProductGrid
              products={filteredProducts}
              onProductClick={onProductClick}
            />
          </div>
        </Flex>
      </Card>
    );
  },
);

ProductsSection.displayName = "ProductsSection";

export default ProductsSection;
