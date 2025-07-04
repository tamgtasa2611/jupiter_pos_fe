import React, { useMemo, useState } from "react";
import { Table, Dropdown, Button, Space, App, Tag, Flex } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { deleteUser } from "@/requests/user";
import DeleteEmployeeModal from "./DeleteEmployeeModal";

const EmployeeTable = ({
  employees,
  loading,
  handleTableChange,
  setSelectedEmployee,
  setViewModalVisible,
  setEditModalVisible,
  setDeleteModalVisible,
  paginationConfig,
  onDeleteUser,
  fetchEmployees,
}) => {
  const { message } = App.useApp();
  const [selectedEmployee, setSelectedEmployeeState] = useState(null);
  const [localDeleteModalVisible, setLocalDeleteModalVisible] = useState(false);
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      const res = await deleteUser(selectedEmployee.id);
      if (res) {
        message.error(res || "Xóa nhân viên thất bại!");
        return;
      }
      message.success("Xóa nhân viên thành công!");
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Xóa nhân viên thất bại!",
      );
    } finally {
      setLocalDeleteModalVisible(false);
      fetchEmployees();
    }
  };

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
        render: (active) => {
          return (
            <Flex justify="center" align="center">
              {active ? (
                <Tag color="green">Đang hoạt động</Tag>
              ) : (
                <Tag color="red">Ngừng hoạt động</Tag>
              )}
            </Flex>
          );
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
                    setSelectedEmployeeState(record);
                    setLocalDeleteModalVisible(true);
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
    <>
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
      <DeleteEmployeeModal
        visible={localDeleteModalVisible}
        onCancel={() => setLocalDeleteModalVisible(false)}
        onDelete={handleDeleteEmployee}
        employee={selectedEmployee}
      />
    </>
  );
};

export default EmployeeTable;
