import { memo } from "react";
import {
  Card,
  Typography,
  Tag,
  Divider,
  Button,
  Tooltip,
  Flex,
  Image,
} from "antd";
import { InfoCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { FALLBACK_IMAGE } from "@/constants/product";

const { Title, Text, Paragraph } = Typography;

const ProductCard = memo(
  ({ product, onProductClick, onAddToCart, loading }) => {
    return (
      <Card
        hoverable
        onClick={() => onProductClick(product)}
        style={{
          overflow: "hidden",
          cursor: "pointer",
          height: 400, // Chiều cao cố định cho Card
          display: "flex",
          flexDirection: "column"
        }}
        variant="outlined"
        bodyStyle={{
          padding: 12,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
        cover={
          <div
            style={{
              position: "relative",
              textAlign: "center",
              background: "#f9f9f9",
            }}
          >
            <Image
              alt={product.name}
              src={product.image ? product.image : null}
              style={{
                minHeight: 200,
                maxHeight: 200,
                objectFit: "contain",
                width: "100%",
              }}
              preview={false}
              fallback={FALLBACK_IMAGE}
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
        {/* Header: tên sản phẩm   */}
        <div style={{ marginBottom: 4, minHeight: 40, maxHeight: 40 }}>
          <Paragraph level={5} style={{ margin: 0, fontWeight: "bold" }} ellipsis={{ rows: 2 }}>
            {product.name}
          </Paragraph>
        </div>

        {/* category sản phẩm */}
        <div style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#888" }} ellipsis>
            Danh mục: {product.category ? product.category : ""}
          </Text>
        </div>

        {/* Mô tả sản phẩm */}
        <div style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#888" }} ellipsis>
            Mô tả: {product.description ? product.description : " "}
          </Text>
        </div>

        <Divider style={{ margin: "8px 0" }} />
        {/* Footer: Giá & nút Thêm vào giỏ hàng */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#1890ff" }} ellipsis>
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
  },
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
