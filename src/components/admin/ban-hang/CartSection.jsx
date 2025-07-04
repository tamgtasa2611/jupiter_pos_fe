import React, { memo } from "react";
import { Card, Badge, Typography, Flex } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CartItem from "./CartItem";

const { Text } = Typography;

const CartSection = memo(
  ({
    cart,
    totalItems,
    onRemove,
    onUpdateQuantity,
    onOpenKeypad,
    onOpenPriceModal,
    theme,
  }) => {
    return (
      <Card
        title={
          <Flex
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
          >
            <Text strong>Giỏ hàng</Text>
            <Badge count={totalItems} showZero />
          </Flex>
        }
        styles={{
          body: {
            padding: 0,
            height: "calc(100% - 56px)",
            display: "flex",
            flexDirection: "column",
          },
        }}
        className="h-full"
      >
        <div className="overflow-auto p-4 flex-grow">
          {cart.length === 0 ? (
            <Flex vertical justify="center" align="center" className="h-full">
              <ShoppingCartOutlined
                style={{ fontSize: 32, color: theme.token.colorTextSecondary }}
              />
              <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                Giỏ hàng trống
              </Text>
            </Flex>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={onRemove}
                onUpdateQuantity={onUpdateQuantity}
                onOpenKeypad={onOpenKeypad}
                onOpenPriceModal={onOpenPriceModal}
              />
            ))
          )}
        </div>
      </Card>
    );
  },
);

CartSection.displayName = "CartSection";

export default CartSection;
