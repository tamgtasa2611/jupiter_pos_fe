import React from "react";
import { Row, Col, Card, Typography, Space } from "antd";

const { Text } = Typography;

const ProductGrid = ({ products, onProductClick }) => {
  return (
    <Row gutter={[16, 16]}>
      {products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4} key={product.id}>
          <Card
            hoverable
            cover={
              <img
                alt={product.name}
                src={product.image}
                style={{
                  height: "140px",
                  objectFit: "contain",
                  width: "100%",
                  padding: "8px",
                }}
              />
            }
            onClick={() => onProductClick(product)}
            styles={{ body: { padding: "8px" } }}
            className="product-card"
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text strong ellipsis title={product.name}>
                {product.name}
              </Text>
              <Text type="danger">{product.price.toLocaleString()} đ</Text>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
