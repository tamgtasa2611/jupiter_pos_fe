import React, { memo } from "react";
import { Row, Col, Button, Spin } from "antd";
import ProductCard from "./ProductCard";

const ProductGrid = memo(
  ({ products, onProductClick, loadingMore, handleLoadMore }) => {
    return (
      <>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={12} lg={8} xxl={6}>
              <ProductCard product={product} onProductClick={onProductClick} />
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          {loadingMore ? (
            <Spin />
          ) : (
            <Button onClick={handleLoadMore} type="default">
              Xem thêm sản phẩm
            </Button>
          )}
        </div>
      </>
    );
  },
);

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
