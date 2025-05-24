import { memo } from "react";
import { Card, Typography, Tag, Divider, Button, Tooltip, Flex } from "antd";
import { InfoCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ProductCard = memo(({ product, onProductClick, onAddToCart }) => {
  // Render các thẻ thuộc tính nếu có
  const renderAttributes = () => {
    if (product.attrValues && product.attrValues.length > 0) {
      return product.attrValues.map((attr, index) => (
        <Tag key={index} color="blue" style={{ marginRight: 4 }}>
          {attr.attrName}: {attr.attrValue}
        </Tag>
      ));
    }
    return null;
  };

  return (
    <Card
      hoverable
      onClick={() => onProductClick(product)}
      style={{
        overflow: "hidden",
        cursor: "pointer"
      }}
      bodyStyle={{ padding: 12 }}
      cover={
        <div
          style={{
            position: "relative",
            textAlign: "center",
            background: "#f9f9f9",
          }}
        >
          <img
            alt={product.name}
            src={product.image}
            style={{ maxHeight: 100, objectFit: "contain", width: "100%" }}
          />
          {product.expiryDate && (
            <Tag
              style={{ position: "absolute", top: 8, right: 8, fontSize: 11 }}
              color="red"
            >
              HSD: {new Date(product.expiryDate).toLocaleDateString("vi-VN")}
            </Tag>
          )}
        </div>
      }
    >
      {/* Header: tên sản phẩm & category  */}
      <div style={{ marginBottom: 8 }}>
        <Title level={5} style={{ margin: 0 }} ellipsis>
          {product.name}
        </Title>
        {product.category && (
          <Text style={{ fontSize: 12, color: "#888" }}>
            {product.category}
          </Text>
        )}
      </div>

      {renderAttributes() && (
        <div style={{ marginBottom: 8 }}>{renderAttributes()}</div>
      )}
      {/* Mô tả sản phẩm */}
      {product.description && (
        <Text style={{ fontSize: 12, color: "#666" }} ellipsis>
          {product.description}
        </Text>
      )}
      <Divider style={{ margin: "8px 0" }} />
      {/* Footer: Giá & nút Thêm vào giỏ hàng */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
          {product.price != null
            ? product.price.toLocaleString() + " đ"
            : "N/A"}
        </Title>
      </div>
      {/* Thông tin tồn kho và tooltip SKU / Mã vạch */}
      <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
        <div>
          <span
            className={`font-semibold ${
              product.quantity != null
                ? product.quantity <= 10
                  ? "text-red-500"
                  : product.quantity <= 30
                    ? "text-orange-500"
                    : "text-green-600"
                : ""
            }`}
          >
            Tồn: {product.quantity != null ? product.quantity : "N/A"}
          </span>
        </div>
        <Tooltip
          title={
            <>
              <div>SKU: {product.sku || "N/A"}</div>
              <div>Mã vạch: {product.barcode || "N/A"}</div>
            </>
          }
          placement="top"
        >
          <InfoCircleOutlined
            style={{ fontSize: 14, color: "#888", marginLeft: 8 }}
          />
        </Tooltip>
      </Flex>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
