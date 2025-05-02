import React from "react";
import { Card, Typography, Space, Divider } from "antd";

const { Text } = Typography;

const OrderSummary = ({ cart, totalAmount }) => {
  // Calculate total number of products
  const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card
      title="Tổng đơn hàng"
      className="h-full"
      bodyStyle={{
        height: "calc(100% - 46px)", // Account for header height
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent the card body from expanding
      }}
    >
      {/* Scrollable product list */}
      <div
        style={{
          flex: "1 1 0%", // Important: 0% base size forces scrolling
          minHeight: 0, // Critical for Firefox
          overflowY: "auto",
          overflowX: "hidden",
        }}
        className="p-2"
      >
        {cart.map((item) => (
          <div key={item.id} style={{ marginBottom: 8 }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Text>
                {item.name} x {item.quantity}
              </Text>
              <Text>{(item.price * item.quantity).toLocaleString()} đ</Text>
            </Space>
          </div>
        ))}
      </div>

      {/* Fixed footer area */}
      <div style={{ flexShrink: 0 }} className="p-2">
        <Divider style={{ margin: "8px 0" }} />

        {/* Total products line */}
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text strong>Tổng số sản phẩm</Text>
          <Text strong>{totalProducts}</Text>
        </Space>

        {/* Total amount line */}
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text strong>Tổng tiền</Text>
          <Text strong>{totalAmount.toLocaleString()} đ</Text>
        </Space>
      </div>
    </Card>
  );
};

export default OrderSummary;
