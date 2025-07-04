import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ManOutlined,
  MoreOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Flex, Table } from "antd";
import React, { useMemo } from "react";

const CustomerTable = ({
  customers,
  loading,
  handleTableChange,
  setSelectedCustomer,
  setViewModalVisible,
  setEditModalVisible,
  setDeleteModalVisible,
  paginationConfig,
}) => {
  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 60,
      },
      {
        title: "Tên khách hàng",
        dataIndex: "customerName",
        key: "customerName",
        ellipsis: true,
        width: 240,
        render: (_, record) => {
          return (
            <Flex gap={8} align="center" justify="flex-start">
              {record.gender != null && record.gender != undefined ? (
                <span>
                  {record.gender ? (
                    <ManOutlined style={{ color: "var(--primary-color)" }} />
                  ) : (
                    <WomanOutlined style={{ color: "#ff1493" }} />
                  )}
                </span>
              ) : (
                <span>
                  <UserOutlined />
                </span>
              )}
              <span>{record.customerName}</span>
            </Flex>
          );
        },
      },
      {
        title: "Điện thoại",
        dataIndex: "phone",
        key: "phone",
        ellipsis: true,
        width: 100,
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        ellipsis: true,
        width: 320,
      },
      {
        title: "Tổng đơn hàng",
        dataIndex: "totalOrders",
        key: "totalOrders",
        ellipsis: true,
        width: 120,
        sorter: true,
        render: (orders) => orders || "-",
      },
      {
        title: "Tổng chi tiêu",
        dataIndex: "totalSpent",
        key: "totalSpent",
        ellipsis: true,
        width: 120,
        sorter: true,
        render: (spent) =>
          new Intl.NumberFormat("vi-VN").format(spent) + "đ" || "-",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdDate",
        key: "createdDate",
        ellipsis: true,
        width: 120,
        render: (date) =>
          new Intl.DateTimeFormat("vi-VN").format(new Date(date)),
      },
      {
        title: "Thao tác",
        key: "action",
        ellipsis: true,
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
                    setSelectedCustomer(record);
                    setViewModalVisible(true);
                  },
                },
                {
                  key: "edit",
                  label: "Chỉnh sửa",
                  icon: <EditOutlined />,
                  onClick: () => {
                    setSelectedCustomer(record);
                    setEditModalVisible(true);
                  },
                },
                {
                  key: "delete",
                  label: "Xóa",
                  icon: <DeleteOutlined />,
                  onClick: () => {
                    setSelectedCustomer(record);
                    setDeleteModalVisible(true);
                  },
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        ),
      },
    ],
    [],
  );
  return (
    <>
      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={loading}
        bordered
        scroll={{ x: 1000, y: "calc(100vh - 352px)" }}
        style={{ height: "100%" }}
        sticky
        pagination={paginationConfig}
        onChange={handleTableChange}
        size="middle"
        locale={{ emptyText: "Không có dữ liệu" }}
      />
    </>
  );
};

export default CustomerTable;
