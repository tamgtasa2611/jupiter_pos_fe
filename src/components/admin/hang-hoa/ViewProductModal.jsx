"use client";

import React from "react";
import { Modal, Descriptions, Tag, Image, Button, Typography, Divider } from "antd";
import { EditOutlined, BarcodeOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ViewProductModal = ({ visible, onCancel, product, isMobile }) => {
  if (!product) return null;

  console.log(product);
  
  return (
    <Modal
      title={
        <Title level={5} className="m-0">
          Chi tiết sản phẩm
        </Title>
      }
      {...(isMobile && { centered: true })}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
            <Image
              alt={product.name}
              src={product.image}
              className="max-w-full rounded"
              style={{ maxHeight: "200px", objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="md:w-2/3">
          <Descriptions bordered column={1} size="small" className="bg-white">
            <Descriptions.Item label="Mã sản phẩm">
              <div className="flex items-center">
                <BarcodeOutlined className="mr-2" />
                <span className="font-mono">{product.barcode}</span>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Tên sản phẩm">
              <strong>{product.name}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">{product.categoryName}</Descriptions.Item>
            <Descriptions.Item label="Giá bán">
              <span className="text-blue-600 font-semibold">
                {new Intl.NumberFormat("vi-VN").format(product.price)}đ
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Giá nhập">
              <span>{new Intl.NumberFormat("vi-VN").format(product.costPrice)}đ</span>
            </Descriptions.Item>
            <Descriptions.Item label="Tồn kho">
              <span
                className={`font-semibold ${
                  product.stock < 10
                    ? "text-red-500"
                    : product.stock < 30
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {product.stock} {product.unit}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={product.isActive ? "green" : "red"}>
                {product.isActive ? "Đang bán" : "Ngừng bán"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(product.createdAt).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>

          {product.description && (
            <>
              <Divider orientation="left" plain className="mt-4 mb-2">
                Mô tả sản phẩm
              </Divider>
              <div className="bg-gray-50 p-3 rounded">
                {product.description || "Không có mô tả"}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
