import React, { memo } from "react";
import { Row, Col, Button, Spin } from "antd";
import ProductCard from "./ProductCard";

const ProductGrid = memo(
  ({
    products,
    onProductClick,
    loadingMore,
    handleLoadMore,
    isInitial,
  }) => {
    return (
      <>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={12} lg={8} xxl={6}>
              <ProductCard product={product} onProductClick={onProductClick} />
            </Col>
          ))}
        </Row>
        {/* Chỉ hiển thị nút "Xem thêm sản phẩm" nếu không phải load đầu */}
        {!isInitial &&
          (loadingMore ? (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Spin />
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button onClick={handleLoadMore} type="default">
                Xem thêm sản phẩm
              </Button>
            </div>
          ))}
      </>
    );
  },
);

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
