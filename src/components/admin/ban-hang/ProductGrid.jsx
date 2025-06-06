import React, { memo } from "react";
import { Row, Col, Button, Spin, Typography } from "antd";
import ProductCard from "./ProductCard";

const { Text } = Typography;
const ProductGrid = memo(
  ({
    products,
    onProductClick,
    loadingMore,
    handleLoadMore,
    isInitial,
    loading,
    outOfProducts,
    setOutOfProducts,
  }) => {
    return (
      <>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={12} lg={8} xxl={6}>
              <ProductCard
                product={product}
                onProductClick={onProductClick}
                loading={loading}
              />
            </Col>
          ))}
        </Row>
        {/* Chỉ hiển thị nút "Xem thêm sản phẩm" nếu không phải load đầu và chưa hết sản phẩm */}
        {!isInitial &&
          (loadingMore ? (
            <div
              style={{ textAlign: "center", marginTop: 24, marginBottom: 8 }}
            >
              <Spin />
            </div>
          ) : !outOfProducts ? (
            <div
              style={{ textAlign: "center", marginTop: 24, marginBottom: 8 }}
            >
              <Button onClick={handleLoadMore} type="default">
                Xem thêm sản phẩm
              </Button>
            </div>
          ) : (
            <div
              style={{ textAlign: "center", marginTop: 24, marginBottom: 8 }}
            >
              <Text type="secondary">Không còn sản phẩm nào để hiển thị</Text>
            </div>
          ))}
      </>
    );
  },
);

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
