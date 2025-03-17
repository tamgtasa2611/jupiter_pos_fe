import React from "react";
import { Row, Col, Card, Typography, Space } from "antd";

const { Text } = Typography;

const ProductGrid = ({ products, onProductClick }) => {
  return (
    <Row gutter={[12, 12]}>
      {products.map((product) => (
        <Col xs={12} sm={8} md={6} lg={6} xl={4} key={product.id}>
          <Card
            hoverable
            cover={<img alt={product.name} src={product.image} style={{ objectFit: "cover" }} />}
            onClick={() => onProductClick(product)}
            styles={{ body: { padding: 0 } }}
            style={{ padding: "8px" }}
          >
            <Space direction="vertical" size={0} style={{ width: "100%", padding: "0" }}>
              <Text ellipsis>{product.name}</Text>
              <Text type="danger">{product.price.toLocaleString()} đ</Text>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
