import React, { useState, useEffect } from "react";
import { Card, App, Button, Spin, Flex } from "antd";
import { ReloadOutlined, UserOutlined } from "@ant-design/icons";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeTable from "./EmployeeTable";
import {
  AddEmployeeModal,
  EditEmployeeModal,
  DeleteEmployeeModal,
  ViewEmployeeModal,
} from "./EmployeeModals";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/requests/employee";

const EmployeePage = () => {
  const { message } = App.useApp();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
  });

  const fetchEmployees = async (
    page = 0,
    size = pagination.pageSize,
    search = searchText,
  ) => {
    setLoading(true);
    try {
      const res = await getEmployees({ page, size, search });
      setEmployees(res.content || []);
      setPagination((prev) => ({
        ...prev,
        total: res.totalElements || 0,
        current: page,
      }));
    } catch (error) {
      message.error("Lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchText(trimmedValue);
    setPagination((prev) => ({ ...prev, current: 0 }));
    fetchEmployees(0, pagination.pageSize, trimmedValue);
  };

  const handleAddEmployee = async (values) => {
    try {
      await createEmployee(values);
      message.success("Thêm nhân viên thành công");
      setAddModalVisible(false);
      fetchEmployees();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi thêm nhân viên");
    }
  };

  const handleEditEmployee = async (values) => {
    try {
      let res;

      if (
        !(
          selectedEmployee.username === values.username &&
          selectedEmployee.email === values.email &&
          selectedEmployee.fullName === values.fullName &&
          selectedEmployee.phoneNumber === values.phoneNumber &&
          selectedEmployee.gender === values.gender &&
          selectedEmployee.active === values.active
        )
      ) {
        res = await updateEmployee(selectedEmployee.id, values);
      }
      if (res?.response?.data?.error) {
        message.error(res.response.data.message);
        return;
      } else {
        message.success("Cập nhật nhân viên thành công");
        setEditModalVisible(false);
        fetchEmployees();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật nhân viên",
      );
      return error;
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(selectedEmployee.id);
      message.success("Xóa nhân viên thành công");
      setDeleteModalVisible(false);
      fetchEmployees();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi xóa nhân viên");
    }
  };

  const handleTableChange = (tablePagination, filters, sorter) => {
    // Backend dùng page 0-index
    const page = tablePagination.current - 1;
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: tablePagination.pageSize,
    }));
    fetchEmployees(page, tablePagination.pageSize, searchText);
  };

  return (
    <Card className="transition-shadow h-fit-screen">
      <EmployeeHeader />
      <Flex
        gap={16}
        vertical
        justify="space-between"
        style={{ height: "100%" }}
      >
        <Flex gap={8} justify="space-between" align="center">
          <EmployeeSearch
            onSearch={handleSearch}
            loading={loading}
            searchText={searchText}
            setSearchText={setSearchText}
            isMobile={false}
          />
          <Flex gap={8}>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => setAddModalVisible(true)}
            >
              Thêm nhân viên
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchEmployees()}
              loading={loading}
            ></Button>
          </Flex>
        </Flex>

        <EmployeeTable
          employees={employees}
          loading={loading}
          handleTableChange={handleTableChange}
          setSelectedEmployee={setSelectedEmployee}
          setViewModalVisible={setViewModalVisible}
          setEditModalVisible={setEditModalVisible}
          setDeleteModalVisible={setDeleteModalVisible}
          paginationConfig={{
            current: pagination.current + 1, // chuyển từ 0-index sang 1-index cho Table
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
        />
      </Flex>
      <AddEmployeeModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onAdd={handleAddEmployee}
      />
      <EditEmployeeModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onEdit={handleEditEmployee}
        employeeId={selectedEmployee?.id}
      />
      <DeleteEmployeeModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onDelete={handleDeleteEmployee}
        employee={selectedEmployee}
      />
      <ViewEmployeeModal
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        employeeId={selectedEmployee?.id}
      />
    </Card>
  );
};

export default EmployeePage;
