import React from "react";
import { Card, Descriptions, Tag, List, Image, Flex } from "antd";
import { FALLBACK_IMAGE } from "@constants/product";

const ProductInfo = ({ order }) => {
  return (
    <div
      style={{
        maxHeight: "calc(100vh - 240px)",
        overflowY: "auto",
        borderRadius: 8,
      }}
    >
      <List
        itemLayout="vertical"
        dataSource={order.orderDetails}
        renderItem={(detail, index) => {
          const variant = detail.productVariant;
          const product = variant.product;
          return (
            <Card
              key={index}
              style={{
                marginBottom: 16,
                boxShadow: "0",
              }}
            >
              <Flex justify="flex-start" align="center" gap={16}>
                <Image
                  src={variant?.imagePaths?.[0] || FALLBACK_IMAGE}
                  alt={product.productName}
                  width={120}
                  height={120}
                  style={{
                    objectFit: "contain",
                    borderRadius: 8,
                    marginRight: 16,
                    overflow: "hidden",
                  }}
                />
                <Descriptions
                  title={`Sản phẩm ${index + 1}`}
                  column={1}
                  size="small"
                  style={{ flex: 1 }}
                >
                  <Descriptions.Item label="Tên sản phẩm">
                    {product.productName}
                  </Descriptions.Item>
                  <Descriptions.Item label="SKU">
                    {variant.sku || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá bán">
                    {detail.price != null
                      ? new Intl.NumberFormat("vi-VN").format(detail.price) +
                        " đ"
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng bán">
                    {detail.soldQuantity}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thành tiền">
                    {detail.soldPrice != null
                      ? new Intl.NumberFormat("vi-VN").format(
                          detail.soldPrice,
                        ) + " đ"
                      : "-"}
                  </Descriptions.Item>
                  {variant.attrValues && variant.attrValues.length > 0 && (
                    <Descriptions.Item label="Thuộc tính">
                      {variant.attrValues.map((attr) => (
                        <Tag key={attr.attrId} style={{ marginBottom: 4 }}>
                          <strong>{attr.attrName}</strong>: {attr.attrValue}{" "}
                          {attr.unitName ? `(${attr.unitName})` : ""}
                        </Tag>
                      ))}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Flex>
            </Card>
          );
        }}
      />
    </div>
  );
};

export default ProductInfo;
