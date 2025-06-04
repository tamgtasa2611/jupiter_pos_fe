import React from "react";
import { Table, Button, Tag, Space } from "antd";
import { ORDER_STATUS_MAP } from "@constants/order";

const OrderTable = ({
  orders,
  loading,
  pagination,
  onTableChange,
  onShowDetails,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      ellipsis: true,
      render: (text) => new Intl.DateTimeFormat("vi-VN").format(new Date(text)),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "receiverName",
      key: "receiverName",
      ellipsis: true,
    },
    {
      title: "SĐT",
      dataIndex: "receiverPhone",
      key: "receiverPhone",
      ellipsis: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "receiverAddress",
      key: "receiverAddress",
      ellipsis: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
      render: (note) => note || "-",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      ellipsis: true,
      render: (amount) => new Intl.NumberFormat("vi-VN").format(amount) + "đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      ellipsis: true,
      render: (status) => {
        const currentStatus = ORDER_STATUS_MAP[status] || { label: status, color: "grey" };
        return <Tag color={currentStatus.color}>{currentStatus.label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" onClick={() => onShowDetails(record)}>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
      scroll={{ x: 1000, y: "calc(100vh - 368px)" }}
      style={{ height: "100%" }}
      sticky
      size="middle"
    />
  );
};

export default OrderTable;
