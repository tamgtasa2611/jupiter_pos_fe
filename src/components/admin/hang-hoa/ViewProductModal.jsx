"use client";

import { BarcodeOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Descriptions, Image, Modal, Space, Tag } from "antd";
import { useRouter } from "next/navigation";

const ViewProductModal = ({ visible, onCancel, product, isMobile }) => {
  const router = useRouter();
  if (!product) return null;

  return (
    <Modal
      title="Chi tiết sản phẩm"
      open={visible}
      onCancel={onCancel}
      width={isMobile ? "90%" : 700}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
        <Button
          key="detail"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            router.push(`/admin/hang-hoa/${product.id}`);
          }}
        >
          Xem chi tiết
        </Button>,
      ]}
      centered={!isMobile}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Image */}
        <div className="md:w-1/3">
          <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
            <Image
              alt={product.name}
              src={product.image}
              className="rounded"
              style={{ maxHeight: "220px", objectFit: "contain" }}
              fallback="https://via.placeholder.com/220x220?text=No+Image"
              preview={false}
            />
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:w-2/3">
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tên biến thể">
              <div>
                <div className="font-medium text-lg">{product.name}</div>
                {product.originName && (
                  <div className="text-xs text-gray-500">
                    Sản phẩm gốc: {product.originName}
                  </div>
                )}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Mã sản phẩm">
              <Space>
                <BarcodeOutlined />
                <span className="font-mono">{product.barcode}</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Giá bán">
              <span className="text-blue-600 font-semibold">
                {new Intl.NumberFormat("vi-VN").format(product.price)}đ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Giá nhập">
              <span className="text-gray-600">
                {new Intl.NumberFormat("vi-VN").format(product.costPrice)}đ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Tồn kho">
              <span
                className={`font-semibold ${
                  product.quantity <= 10
                    ? "text-red-500"
                    : product.quantity <= 30
                      ? "text-orange-500"
                      : "text-green-600"
                }`}
              >
                {product.quantity}
              </span>
            </Descriptions.Item>
            {product.expiryDate && (
              <Descriptions.Item label="Hạn sử dụng">
                {new Date(product.expiryDate).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            )}
            {product.attrValues && product.attrValues.length > 0 && (
              <Descriptions.Item label="Thuộc tính">
                {product.attrValues.map((attr, idx) => (
                  <Tag key={idx} color="blue" className="mb-1">
                    {attr.attrName}: {attr.attrValue}
                  </Tag>
                ))}
              </Descriptions.Item>
            )}
            {product.description && (
              <Descriptions.Item label="Mô tả sản phẩm">
                {product.description}
              </Descriptions.Item>
            )}
            {product.category && (
              <Descriptions.Item label="Danh mục">
                {product.category}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
