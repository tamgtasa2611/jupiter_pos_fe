import React from "react";
import { Card, Statistic, Divider, Space, Typography, Row, Col } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const { Text } = Typography;

const OrderSummary = ({ cart, totalAmount }) => {
  const discount = 0; // Calculate discount if needed
  const tax = Math.round(totalAmount * 0.1); // 10% tax example
  const finalTotal = totalAmount + tax - discount;

  return (
    <Card className="    ">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Text>Tạm tính ({cart.length} sản phẩm):</Text>
          </Col>
          <Col>
            <Text>{totalAmount.toLocaleString()} đ</Text>
          </Col>
        </Row>
        <Row justify="space-between" align="middle">
          <Col>
            <Text>Thuế (10%):</Text>
          </Col>
          <Col>
            <Text>{tax.toLocaleString()} đ</Text>
          </Col>
        </Row>
        <Row justify="space-between" align="middle">
          <Col>
            <Text>Giảm giá:</Text>
          </Col>
          <Col>
            <Text>{discount.toLocaleString()} đ</Text>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0" }} />
        <Row justify="space-between" align="middle">
          <Col>
            <Text strong style={{ fontSize: 16 }}>
              Tổng cộng:
            </Text>
          </Col>
          <Col>
            <Statistic
              value={finalTotal}
              suffix="đ"
              valueStyle={{ color: "#cf1322", fontSize: 20 }}
              prefix={<DollarOutlined />}
            />
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default OrderSummary;
