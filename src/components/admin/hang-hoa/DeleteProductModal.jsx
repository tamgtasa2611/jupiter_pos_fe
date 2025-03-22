"use client";

import React from "react";
import { Modal, Typography, Button, Space, Alert } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMobileStyles } from "@atoms/common";

const { Text, Title } = Typography;

const DeleteProductModal = ({ visible, onCancel, onDelete, product }) => {
  if (!product) return null;

  const mobileStyles = useMobileStyles();

  // Mobile style configurations
  const mobileInputStyle = { ...mobileStyles.input };
  const mobileSelectStyle = { ...mobileStyles.select };
  const mobileSwitchStyle = { ...mobileStyles.switch };
  const mobileFormItemStyle = { ...mobileStyles.formItem };
  const mobileButtonStyle = { ...mobileStyles.button };

  return (
    <Modal
      title={
        <div className="flex items-center text-red-500">
          <ExclamationCircleOutlined className="mr-2" />
          <span>Xác nhận xóa sản phẩm</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
    >
      <div className="py-4">
        <Alert
          message="Cảnh báo"
          description="Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống."
          type="warning"
          showIcon
          className="mb-4"
        />

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <Title level={5} className="m-0">
            Thông tin sản phẩm:
          </Title>
          <div className="mt-2">
            <p>
              <Text strong>Mã sản phẩm:</Text> {product.barcode}
            </p>
            <p>
              <Text strong>Tên sản phẩm:</Text> {product.name}
            </p>
            <p>
              <Text strong>Danh mục:</Text> {product.categoryName}
            </p>
            <p>
              <Text strong>Tồn kho:</Text> {product.stock} {product.unit}
            </p>
          </div>
        </div>

        <p className="text-center mb-4">Bạn có chắc chắn muốn xóa sản phẩm này?</p>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Hủy</Button>
          <Button danger type="primary" icon={<DeleteOutlined />} onClick={onDelete}>
            Xác nhận xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteProductModal;
