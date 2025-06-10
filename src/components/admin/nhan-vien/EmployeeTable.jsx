import React, { useMemo } from "react";
import { Table, Dropdown, Button, Space } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const EmployeeTable = ({
  employees,
  loading,
  handleTableChange,
  setSelectedEmployee,
  setViewModalVisible,
  setEditModalVisible,
  setDeleteModalVisible,
  paginationConfig,
}) => {
  const columns = useMemo(
    () => [
      { title: "ID", dataIndex: "id", key: "id", width: 60 },
      {
        title: "Họ và tên",
        dataIndex: "fullName",
        key: "fullName",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Tên đăng nhập",
        dataIndex: "username",
        key: "username",
        width: 150,
        ellipsis: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 200,
        ellipsis: true,
      },
      { title: "Số điện thoại", dataIndex: "phone", key: "phone", width: 150 },
      {
        title: "Giới tính",
        dataIndex: "gender",
        key: "gender",
        width: 100,
        render: (gender) => (gender ? "Nam" : "Nữ"),
      },
      {
        title: "Trạng thái",
        dataIndex: "active",
        key: "active",
        width: 120,
        render: (active) => (active ? "Hoạt động" : "Ngưng hoạt động"),
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
                    setSelectedEmployee(record);
                    setViewModalVisible(true);
                  },
                },
                {
                  key: "edit",
                  label: "Chỉnh sửa",
                  icon: <EditOutlined />,
                  onClick: () => {
                    setSelectedEmployee(record);
                    setEditModalVisible(true);
                  },
                },
                {
                  key: "delete",
                  label: "Xóa",
                  icon: <DeleteOutlined />,
                  onClick: () => {
                    setSelectedEmployee(record);
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
    [
      setSelectedEmployee,
      setViewModalVisible,
      setEditModalVisible,
      setDeleteModalVisible,
    ],
  );

  return (
    <Table
      columns={columns}
      dataSource={employees}
      rowKey="id"
      loading={loading}
      pagination={paginationConfig}
      onChange={handleTableChange}
      bordered
      size="middle"
      scroll={{ x: 1000, y: "calc(100vh - 352px)" }}
      style={{ height: "100%" }}
      sticky
      locale={{ emptyText: "Không có dữ liệu" }}
    />
  );
};

export default EmployeeTable;
