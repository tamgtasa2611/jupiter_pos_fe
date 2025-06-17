import React, { memo } from "react";
import { Button, Typography, Divider } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { FALLBACK_IMAGE } from "@/constants/product.js";

const { Text, Paragraph } = Typography;

const CartItem = memo(
  ({ item, onRemove, onUpdateQuantity, onOpenKeypad, onOpenPriceModal }) => {
    return (
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={item.image || FALLBACK_IMAGE}
              alt={item.name}
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                marginRight: 12,
              }}
              className="rounded-md"
            />
            <div>
              <Text strong style={{ display: "block" }}>
                {item.name}
              </Text>
              <Text
                type="danger"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  onOpenPriceModal(item.id, item.soldPrice || item.price)
                }
              >
                {item.soldPrice?.toLocaleString() ||
                  item.price.toLocaleString()}{" "}
                đ
              </Text>
            </div>
          </div>
          <DeleteOutlined
            onClick={() => onRemove(item.id)}
            style={{ color: "red", cursor: "pointer" }}
          />
        </div>

        <div style={{ marginTop: 8 }}>
          {item.attrValues && (
            <Paragraph style={{ fontSize: 12 }} ellipsis={{ rows: 2 }}>
              {item.attrValues
                .map(
                  (attr) =>
                    `${attr.attrName}: ${attr.attrValue} ${attr.unitName ? `(${attr.unitName})` : ""}`,
                )
                .join(", ")}
            </Paragraph>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 8,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              size="small"
              icon={<MinusOutlined />}
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            />

            <span
              style={{
                margin: "0 8px",
                padding: "0 8px",
                border: "1px solid #d9d9d9",
                borderRadius: "2px",
                cursor: "pointer",
              }}
              onClick={() => onOpenKeypad(item.id)}
            >
              {item.quantity}
            </span>

            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            />
          </div>

          <Text strong>
            {((item.soldPrice || item.price) * item.quantity).toLocaleString()}{" "}
            đ
          </Text>
        </div>
        <Divider style={{ margin: "12px 0" }} />
      </div>
    );
  },
);

CartItem.displayName = "CartItem";

export default CartItem;
