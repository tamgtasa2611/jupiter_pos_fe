import { memo, useCallback } from "react";
import { Card, Typography, Space, Tooltip, Tag, Flex } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Component con cho từng card sản phẩm
const ProductCard = memo(({ product, onProductClick, onAddToCart }) => {
  // Handler bấm thêm vào giỏ hàng được memo để không tạo function mới mỗi lần render
  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();
      if (onAddToCart) {
        onAddToCart(product);
      }
    },
    [onAddToCart, product],
  );

  return (
    <Card
      hoverable
      variant="outlined"
      onClick={() => onProductClick(product)}
      style={{
        width: "100%",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        position: "relative",
      }}
      cover={
        <div style={{ position: "relative" }}>
          <img
            alt={product.name}
            src={product.image}
            style={{
              height: 120,
              objectFit: "contain",
              width: "100%",
            }}
          />
          {product.expiryDate && (
            <Tag
              color="red"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                fontSize: 12,
              }}
            >
              HSD: {new Date(product.expiryDate).toLocaleDateString("vi-VN")}
            </Tag>
          )}
        </div>
      }
      bodyStyle={{ padding: 16 }}
    >
      <Flex vertical gap={8} style={{ width: "100%" }}>
        <Title level={5} style={{ margin: 0 }} ellipsis>
          {product.name}
        </Title>
        <Title
          level={4}
          style={{ margin: 0, color: "#1890ff", fontWeight: "bold" }}
        >
          {product.price.toLocaleString()} đ
        </Title>
        <Flex justify="space-between" align="center">
          <Text style={{ fontSize: 12 }}>Tồn kho: {product.quantity}</Text>
          <Tooltip
            title={
              <>
                SKU: {product.sku} <br />
                Mã vạch: {product.barcode}
              </>
            }
            placement="top"
          >
            <InfoCircleOutlined
              style={{ fontSize: 14, color: "#888", cursor: "pointer" }}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
