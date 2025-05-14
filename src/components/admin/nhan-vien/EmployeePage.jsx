"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Divider,
  Typography,
  Tabs,
  message,
  Modal,
  Table,
  Tag,
  Button,
  Form,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import EmployeeList from "./EmployeeList";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeSales from "./EmployeeSales";
import {
  AddEmployeeModal,
  EditEmployeeModal,
  DeleteEmployeeModal,
} from "./EmployeeModals";
import { fetchUsers } from "@requests/user";

const { Title } = Typography;

// Mock data for employees
const initialEmployees = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    code: "NV001",
    position: "Quản lý",
    department: "Ban quản lý",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    status: "active",
    joinDate: "2022-06-15",
    avatar: null,
  },
  {
    id: 2,
    name: "Trần Thị B",
    code: "NV002",
    position: "Nhân viên bán hàng",
    department: "Kinh doanh",
    phone: "0907654321",
    email: "tranthib@example.com",
    status: "active",
    joinDate: "2022-08-10",
    avatar: null,
  },
  {
    id: 3,
    name: "Lê Văn C",
    code: "NV003",
    position: "Nhân viên kho",
    department: "Kho vận",
    phone: "0905678123",
    email: "levanc@example.com",
    status: "inactive",
    joinDate: "2023-01-05",
    avatar: null,
  },
];

// Mock data for attendance
const generateMockAttendanceData = () => {
  const attendanceData = {};
  const today = dayjs();

  // Generate attendance data for the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = today.subtract(i, "day").format("YYYY-MM-DD");

    // For each employee
    initialEmployees.forEach((employee) => {
      if (!attendanceData[employee.id]) {
        attendanceData[employee.id] = [];
      }

      // Skip weekends
      const dayOfWeek = dayjs(date).day();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return;
      }

      // Random attendance status
      const random = Math.random();
      let status;
      let checkIn;
      let checkOut;

      if (random > 0.9) {
        status = "absent";
      } else if (random > 0.8) {
        status = "late";
        checkIn = "09:15:00";
        checkOut = "18:05:00";
      } else {
        status = "present";
        checkIn =
          "08:" +
          Math.floor(Math.random() * 10)
            .toString()
            .padStart(2, "0") +
          ":00";
        checkOut =
          "18:" +
          Math.floor(Math.random() * 30)
            .toString()
            .padStart(2, "0") +
          ":00";
      }

      attendanceData[employee.id].push({
        date,
        status,
        checkIn: status !== "absent" ? checkIn : null,
        checkOut: status !== "absent" ? checkOut : null,
      });
    });
  }

  return attendanceData;
};

const EmployeePage = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);
  const [searchText, setSearchText] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [employeeAttendance, setEmployeeAttendance] = useState({});
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const [form] = Form.useForm();

  // Simulating data fetching
  useEffect(() => {
    setTimeout(() => {
      setAttendanceData(generateMockAttendanceData());
      setLoading(false);
    }, 1000);

    fetchUsers();
  }, []);

  // Filter employees when search text changes
  useEffect(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.code.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredEmployees(filtered);
  }, [searchText, employees]);

  const handleAddEmployee = (values) => {
    const newEmployee = {
      id: employees.length + 1,
      ...values,
      status: "active",
      joinDate: values.joinDate.format("YYYY-MM-DD"),
    };
    setEmployees([...employees, newEmployee]);
    setAddModalVisible(false);
    form.resetFields();
    message.success("Thêm nhân viên thành công!");
  };

  const handleEditEmployee = (values) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === selectedEmployee.id
        ? {
            ...employee,
            ...values,
            joinDate: values.joinDate.format("YYYY-MM-DD"),
          }
        : employee,
    );
    setEmployees(updatedEmployees);
    setEditModalVisible(false);
    message.success("Cập nhật thông tin nhân viên thành công!");
  };

  const handleDeleteEmployee = () => {
    const updatedEmployees = employees.filter(
      (employee) => employee.id !== selectedEmployee.id,
    );
    setEmployees(updatedEmployees);
    setDeleteModalVisible(false);
    message.success("Xóa nhân viên thành công!");
  };

  const showEditModal = (employee) => {
    setSelectedEmployee(employee);
    form.setFieldsValue({
      ...employee,
      joinDate: dayjs(employee.joinDate),
    });
    setEditModalVisible(true);
  };

  const showDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setDeleteModalVisible(true);
  };

  const showAttendanceModal = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeAttendance(attendanceData[employee.id] || []);
    setAttendanceModalVisible(true);
  };

  const renderTabs = () => {
    const items = [
      {
        key: "list",
        label: "Danh sách nhân viên",
        children: (
          <>
            <EmployeeSearch
              searchText={searchText}
              setSearchText={setSearchText}
              setAddModalVisible={setAddModalVisible}
              form={form}
            />
            <EmployeeList
              employees={filteredEmployees}
              loading={loading}
              showAttendanceModal={showAttendanceModal}
              showEditModal={showEditModal}
              showDeleteModal={showDeleteModal}
            />
          </>
        ),
      },
      {
        key: "sales",
        label: "Doanh số",
        children: <EmployeeSales />,
      },
    ];

    return <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />;
  };

  return (
    <div className="employee-management-container">
      <Card>
        <Title level={4}>Nhân viên</Title>
        <Divider />
        {renderTabs()}
      </Card>

      <AddEmployeeModal
        addModalVisible={addModalVisible}
        setAddModalVisible={setAddModalVisible}
        handleAddEmployee={handleAddEmployee}
        form={form}
      />
      <EditEmployeeModal
        editModalVisible={editModalVisible}
        setEditModalVisible={setEditModalVisible}
        handleEditEmployee={handleEditEmployee}
        form={form}
        selectedEmployee={selectedEmployee}
      />
      <DeleteEmployeeModal
        deleteModalVisible={deleteModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
        handleDeleteEmployee={handleDeleteEmployee}
        selectedEmployee={selectedEmployee}
      />

      {/* Employee Attendance Modal */}
      <Modal
        title={`Bảng chấm công: ${selectedEmployee?.name}`}
        open={attendanceModalVisible}
        onCancel={() => setAttendanceModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={employeeAttendance}
          rowKey="date"
          pagination={{ pageSize: 10 }}
          loading={loading}
          columns={[
            {
              title: "Ngày",
              dataIndex: "date",
              key: "date",
              render: (date) => dayjs(date).format("DD/MM/YYYY"),
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              render: (status) => {
                let color = "green";
                let text = "Có mặt";

                if (status === "late") {
                  color = "orange";
                  text = "Đi muộn";
                } else if (status === "absent") {
                  color = "red";
                  text = "Vắng mặt";
                }

                return <Tag color={color}>{text}</Tag>;
              },
            },
            {
              title: "Giờ vào",
              dataIndex: "checkIn",
              key: "checkIn",
              render: (checkIn) => checkIn || "—",
            },
            {
              title: "Giờ ra",
              dataIndex: "checkOut",
              key: "checkOut",
              render: (checkOut) => checkOut || "—",
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default EmployeePage;
