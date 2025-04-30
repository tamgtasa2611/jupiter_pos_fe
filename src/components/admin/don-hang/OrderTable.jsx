import React from "react";
import { Table, Button, Tag, Space } from "antd";

const OrderTable = ({
  orders,
  loading,
  pagination,
  onTableChange,
  onShowDetails,
}) => {
  // Table columns
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a onClick={() => {}}>{text}</a>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: true,
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: true,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <span className="font-semibold text-blue-600">
          {new Intl.NumberFormat("vi-VN").format(amount)}đ
        </span>
      ),
      sorter: true,
    },
    {
      title: "SL sản phẩm",
      dataIndex: "items",
      key: "items",
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Delivered"
              ? "green"
              : status === "Shipped"
                ? "blue"
                : status === "Processing"
                  ? "orange"
                  : status === "Pending"
                    ? "purple"
                    : "red"
          }
        >
          {status}
        </Tag>
      ),
      sorter: true,
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
      scroll={{ x: 1000, y: 600 }}
      size="middle"
    />
  );
};

export default OrderTable;
