import React from "react";
import { Card, Descriptions, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { ORDER_STATUS_MAP } from "@constants/order";
const { Paragraph } = Typography;

const OrderInfo = ({ order }) => {
  return (
    <Card>
      <Descriptions column={2} size="large">
        <Descriptions.Item label="Mã đơn hàng">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          {order.orderDate
            ? dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Người xử lý">
          {order?.user?.fullName || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tên khách hàng">
          {order.customer && order.customer.customerName
            ? order.customer.customerName
            : order.receiverName || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={ORDER_STATUS_MAP[order.orderStatus]?.color || "default"}>
            {ORDER_STATUS_MAP[order.orderStatus]
              ? ORDER_STATUS_MAP[order.orderStatus].label
              : order.orderStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {order.receiverPhone ||
            (order.customer && order.customer.phone) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {order.totalAmount != null
            ? new Intl.NumberFormat("vi-VN").format(order.totalAmount) + " đ"
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ nhận hàng">
          {order.receiverAddress ||
            (order.customer && order.customer.address) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          <Paragraph ellipsis={{ rows: 2, tooltip: order.note }}>
            {order.note || "-"}
          </Paragraph>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrderInfo;
