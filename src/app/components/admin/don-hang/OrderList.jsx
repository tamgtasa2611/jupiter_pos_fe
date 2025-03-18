import React from "react";
import { List, Avatar, Row, Col, Tag, Typography } from "antd";

const { Text } = Typography;

const OrderList = ({ orders, loading, pagination, onShowDetails }) => {
  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      dataSource={orders}
      pagination={{
        ...pagination,
        size: "small",
      }}
      renderItem={(item) => (
        <List.Item
          onClick={() => onShowDetails(item)}
          style={{ padding: "12px 16px", cursor: "pointer" }}
        >
          <Row style={{ width: "100%" }} align="middle">
            <Col span={20}>
              <Row justify="space-between">
                <Col>
                  <Text strong>{item.orderId}</Text>
                </Col>
                <Col>
                  <Tag
                    color={
                      item.status === "Delivered"
                        ? "green"
                        : item.status === "Shipped"
                        ? "blue"
                        : item.status === "Processing"
                        ? "orange"
                        : item.status === "Pending"
                        ? "purple"
                        : "red"
                    }
                  >
                    {item.status}
                  </Tag>
                </Col>
              </Row>
              <Row>
                <Text type="secondary">Khách hàng: {item.customerName}</Text>
              </Row>
              <Row>
                <Text>
                  Tổng tiền: {new Intl.NumberFormat("vi-VN").format(item.totalAmount) + "đ"}
                </Text>
              </Row>
              <Row>
                <Text type="secondary">
                  {item.items} sản phẩm • {item.orderDate}
                </Text>
              </Row>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default OrderList;
