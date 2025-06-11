import React from "react";
import { Table, Button, Tag, Space, Dropdown } from "antd";
import { EyeOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { ORDER_STATUS_MAP } from "@constants/order";

const OrderTable = ({
  orders,
  loading,
  pagination,
  onTableChange,
  setSelectedOrderId,
  setViewModalVisible,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 100,
      ellipsis: true,
      render: (text) => new Intl.DateTimeFormat("vi-VN").format(new Date(text)),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "receiverName",
      key: "receiverName",
      ellipsis: true,
      render: (name) => name || "-",
    },
    {
      title: "SĐT",
      dataIndex: "receiverPhone",
      key: "receiverPhone",
      width: 100,
      ellipsis: true,
      render: (phone) => phone || "-",
    },
    {
      title: "Địa chỉ",
      dataIndex: "receiverAddress",
      key: "receiverAddress",
      ellipsis: true,
      render: (address) => address || "-",
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
      width: 140,
      ellipsis: true,
      render: (amount) =>
        new Intl.NumberFormat("vi-VN").format(amount || 0) + "đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 140,
      ellipsis: true,
      render: (status) => {
        const currentStatus = ORDER_STATUS_MAP[status] || {
          label: status,
          color: "grey",
        };
        return <Tag color={currentStatus.color}>{currentStatus.label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                label: "Xem chi tiết",
                icon: <EyeOutlined />,
                onClick: () => {
                  setSelectedOrderId(record.id);
                  setViewModalVisible(true);
                },
              },
              {
                key: "edit",
                label: "Chỉnh sửa",
                icon: <EditOutlined />,
                onClick: () => {
                  // setSelectedCustomer(record);
                  // setEditModalVisible(true);
                },
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
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
      bordered
      scroll={{ x: 1000, y: "calc(100vh - 352px)" }}
      style={{ height: "100%", flex: 1 }}
      sticky
      size="middle"
      locale={{ emptyText: "Không có dữ liệu" }}
    />
  );
};

export default React.memo(OrderTable);
