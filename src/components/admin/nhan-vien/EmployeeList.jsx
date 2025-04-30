import React from "react";
import { Table, Space, Avatar, Tag, Tooltip, Button } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const EmployeeList = ({
  employees,
  loading,
  showAttendanceModal,
  showEditModal,
  showDeleteModal,
}) => {
  const columns = [
    {
      title: "Mã NV",
      dataIndex: "code",
      key: "code",
      width: "10%",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "success" : "error"}>
          {status === "active" ? "Đang làm việc" : "Đã nghỉ việc"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chấm công">
            <Button
              icon={<CalendarOutlined />}
              onClick={() => showAttendanceModal(record)}
              type="text"
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              type="text"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => showDeleteModal(record)}
              danger
              type="text"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={employees}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default EmployeeList;
