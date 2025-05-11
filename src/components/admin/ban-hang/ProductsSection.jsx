import React, { useState, memo } from "react";
import { Card, Flex } from "antd";
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
  }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Chỉ lọc khi cần thiết để tăng hiệu suất
    const filteredProducts = products.filter(
      (product) =>
        (selectedCategory === "all" || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

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
          <SearchBar onSearch={setSearchQuery} />

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
