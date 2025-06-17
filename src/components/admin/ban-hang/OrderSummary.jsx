import React, { memo } from "react";
import { Card, Typography, Space, Divider, Flex } from "antd";

const { Text, Paragraph } = Typography;

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
          <>
            <Flex
              key={item.id}
              justify="space-between"
              align="start"
              style={{ marginBottom: 8 }}
            >
              <Paragraph
                ellipsis={{
                  rows: 1,
                  tooltip: {
                    title: `${item.name} ${item.attrValues !== null && item.attrValues !== undefined ? "-" : ""} ${item.attrValues?.map((attr) => `${attr.attrName}: ${attr.attrValue}`).join(", ") || ""}`,
                  },
                }}
                style={{ marginBottom: 0, flex: "2" }}
              >
                {item.quantity} x {item.name}
              </Paragraph>
              <Text style={{ flex: "1", textAlign: "right" }}>
                {(
                  (item.soldPrice || item.price) * item.quantity
                ).toLocaleString()}{" "}
                đ
              </Text>
            </Flex>
          </>
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
