"use client";

import React from "react";
import { Modal, Descriptions, Tag } from "antd";

const OrderDetailsModal = ({ visible, onCancel, order }) => {
  if (!order) return null;

  return (
    <Modal
      title={`Chi tiết đơn hàng: ${order.orderId}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã đơn hàng">{order.orderId}</Descriptions.Item>
        <Descriptions.Item label="Tên khách hàng">{order.customerName}</Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">{order.orderDate}</Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {new Intl.NumberFormat("vi-VN").format(order.totalAmount)}đ
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag
            color={
              order.status === "Delivered"
                ? "green"
                : order.status === "Shipped"
                ? "blue"
                : order.status === "Processing"
                ? "orange"
                : order.status === "Pending"
                ? "purple"
                : "red"
            }
          >
            {order.status}
          </Tag>
        </Descriptions.Item>
        {/* Add more order details here as needed */}
      </Descriptions>
    </Modal>
  );
};

export default OrderDetailsModal;
