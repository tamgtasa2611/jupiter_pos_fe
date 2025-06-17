import React, { useState, useEffect } from "react";
import { Modal, InputNumber, Button, Typography, Space } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const { Text } = Typography;

const PriceEditModal = ({
  visible,
  onCancel,
  onConfirm,
  currentPrice,
  productName,
}) => {
  const [newPrice, setNewPrice] = useState(currentPrice);

  useEffect(() => {
    setNewPrice(currentPrice);
  }, [currentPrice]);

  const handleConfirm = () => {
    if (newPrice > 0) {
      onConfirm(newPrice);
      onCancel();
    }
  };

  return (
    <Modal
      title="Sửa giá sản phẩm"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
    >
      <div style={{ padding: "16px 0" }}>
        <Text strong style={{ display: "block", marginBottom: 8 }}>
          {productName}
        </Text>
        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          Giá hiện tại: {currentPrice?.toLocaleString()} đ
        </Text>

        <div style={{ marginBottom: 16 }}>
          <Text>Giá mới:</Text>
          <InputNumber
            style={{ width: "100%", marginTop: 8 }}
            size="large"
            value={newPrice}
            onChange={setNewPrice}
            min={0}
            step={500}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            addonAfter="đ"
          />
        </div>

        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            icon={<DollarOutlined />}
            onClick={handleConfirm}
            disabled={!newPrice || newPrice <= 0}
          >
            Cập nhật
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PriceEditModal;
