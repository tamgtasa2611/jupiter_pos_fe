import React, { memo } from "react";
import { Card, Typography, Space, Divider } from "antd";

const { Text } = Typography;

const OrderSummary = memo(({ cart, totalAmount }) => {
  const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card
      title="Tổng đơn hàng"
      className="h-full"
      styles={{
        body: {
          height: "calc(100% - 46px)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <div
        style={{
          flex: "1 1 0%",
          minHeight: 0,
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

      <div style={{ flexShrink: 0 }} className="p-2">
        <Divider style={{ margin: "8px 0" }} />

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

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text strong>Tổng tiền</Text>
          <Text strong>{totalAmount.toLocaleString()} đ</Text>
        </Space>
      </div>
    </Card>
  );
});

OrderSummary.displayName = "OrderSummary";

export default OrderSummary;
