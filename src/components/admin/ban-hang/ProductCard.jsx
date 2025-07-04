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
    const attrValues =
      product.attrValues && product.attrValues.length > 0
        ? product.attrValues.map(
            (attr, idx) =>
              attr.attrValue && (
                <span key={idx}>
                  {attr.attrName}: {attr.attrValue}
                  {idx !== product.attrValues.length - 1 ? ", " : ""}
                </span>
              ),
          )
        : "-";

    const isOutOfStock = product.quantity === 0 || product.quantity == null;

    return (
      <Card
        hoverable={!isOutOfStock}
        onClick={() => !isOutOfStock && onProductClick(product)}
        style={{
          overflow: "hidden",
          cursor: isOutOfStock ? "not-allowed" : "pointer",
          height: 360,
          display: "flex",
          flexDirection: "column",
          opacity: isOutOfStock ? 0.6 : 1,
          position: "relative",
        }}
        styles={{
          body: {
            padding: 12,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 0,
          },
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
                minHeight: 180,
                maxHeight: 180,
                objectFit: "contain",
                width: "100%",
              }}
              preview={false}
              fallback={FALLBACK_IMAGE}
            />

            {isOutOfStock && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(255, 0, 0, 0.8)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  zIndex: 10,
                }}
              >
                HẾT HÀNG
              </div>
            )}
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
        {/* Header: tên sản phẩm */}
        <div
          style={{
            minHeight: 40,
            maxHeight: 40,

            marginBottom: 4,
          }}
        >
          <Paragraph
            level={6}
            style={{ margin: 0, fontWeight: "bold" }}
            ellipsis={{
              rows: 2,
              tooltip: { title: product.name, placement: "right" },
            }}
          >
            {product.name}
          </Paragraph>
        </div>

        {/* Thuộc tính sản phẩm */}
        <div
          style={{
            minHeight: 32,
            maxHeight: 32,
            marginBottom: 4,
          }}
        >
          <Paragraph
            style={{ fontSize: 11, marginTop: 0, marginBottom: 0 }}
            ellipsis={{
              rows: 2,
              tooltip: { title: attrValues, placement: "right" },
            }}
          >
            {attrValues}
          </Paragraph>
        </div>

        {/* Danh mục sản phẩm */}
        <div
          style={{
            minHeight: 18,
            maxHeight: 18,
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#888",
              whiteSpace: "nowrap",

              textOverflow: "ellipsis",
              display: "block",
            }}
            title={product.category}
          >
            Danh mục: {product.category ? product.category : "-"}
          </Text>
        </div>

        {/* Giá sản phẩm */}
        <div
          style={{
            minHeight: 24,
            maxHeight: 24,
            marginBottom: 4,
          }}
        >
          <Title level={5} style={{ color: "#1890ff", margin: 0 }} ellipsis>
            {product.price != null
              ? product.price.toLocaleString() + " đ"
              : "-"}
          </Title>
        </div>

        {/* Thông tin tồn kho và tooltip SKU / Mã vạch */}
        <Flex
          justify="space-between"
          align="center"
          style={{ fontSize: 12, minHeight: 20, maxHeight: 20 }}
        >
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
              Tồn: {product.quantity != null ? product.quantity : "-"}
            </span>
          </div>
          <Tooltip
            title={
              <>
                <div>SKU: {product.sku || "-"}</div>
                <div>Mã vạch: {product.barcode || "-"}</div>
                <div>Mô tả: {product.description || "-"}</div>
              </>
            }
            placement="top"
          >
            <InfoCircleOutlined
              style={{ fontSize: 12, color: "#888", marginLeft: 8 }}
            />
          </Tooltip>
        </Flex>
      </Card>
    );
  },
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
