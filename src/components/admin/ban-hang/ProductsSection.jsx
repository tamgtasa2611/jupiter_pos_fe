import React, { useState } from "react";
import { Card, Flex, Space } from "antd";
import SearchBar from "./SearchBar";
import CategorySelector from "./CategorySelector";
import ProductGrid from "./ProductGrid";

const ProductsSection = ({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  onProductClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

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
};

export default ProductsSection;
