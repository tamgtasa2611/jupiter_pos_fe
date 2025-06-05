"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Input,
  Drawer,
  message,
  Flex,
  Dropdown,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";
import CustomerHeader from "./CustomerHeader";
import { getCustomers } from "@/requests/customer";

const CustomersMainPage = () => {
  // State quản lý danh sách khách hàng và loading
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho các modal
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State cho tìm kiếm, lọc, sắp xếp và phân trang
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);

  // Hàm fetch khách hàng từ API
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      // Nếu backend dự kiến nhận page bắt đầu từ 0
      const page = pagination.current - 1;
      const size = pagination.pageSize;
      const sort =
        sortBy && sortOrder
          ? `${sortBy},${sortOrder === "ascend" ? "asc" : "desc"}`
          : undefined;
      const params = {
        page,
        size,
        search: searchText || undefined,
        sort, // backend có thể bỏ qua nếu sort undefined
      };

      const response = await getCustomers(params);
      setCustomers(response.content || []);
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements || 0,
      }));
    } catch (error) {
      const errMsg =
        (error.response && error.response && error.response.message) ||
        error.message ||
        "Lỗi không xác định";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, sortBy, sortOrder]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Các cột của bảng khách hàng
  const columns = useMemo(
    () => [
      {
        title: "Tên khách hàng",
        dataIndex: "customerName",
        key: "customerName",
        ellipsis: true,
        width: 240,
        render: (text) => <a>{text}</a>,
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
        render: (orders) => orders || 0,
      },
      {
        title: "Tổng chi tiêu",
        dataIndex: "totalSpent",
        key: "totalSpent",
        ellipsis: true,
        width: 120,

        render: (spent) => new Intl.NumberFormat("vi-VN").format(spent) + "đ",
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
            menu={{
              items: [
                {
                  key: "view",
                  label: "Xem chi tiết",
                  icon: <EyeOutlined />,
                  onClick: () => {
                    // Xử lý xem chi tiết nếu cần
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

  // Handler khi tìm kiếm
  const handleSearch = useCallback((value) => {
    setSearchText(value);
    // Reset về trang 1 khi thay đổi điều kiện tìm kiếm
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  // Handler thay đổi bảng: sắp xếp, phân trang
  const handleTableChange = useCallback((tablePagination, filters, sorter) => {
    setPagination((prev) => ({
      ...prev,
      current: tablePagination.current,
      pageSize: tablePagination.pageSize,
    }));
    if (sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order);
    } else {
      setSortBy(null);
      setSortOrder(null);
    }
  }, []);

  // Các hàm xử lý thêm, sửa, xóa khách hàng (thực hiện API nếu có)
  const handleAddCustomer = useCallback(
    (newCustomer) => {
      console.log("Thêm khách hàng:", newCustomer);
      setAddModalVisible(false);
      fetchCustomers();
    },
    [fetchCustomers],
  );

  const handleEditCustomer = useCallback(
    (updatedCustomer) => {
      console.log("Cập nhật khách hàng:", updatedCustomer);
      setEditModalVisible(false);
      fetchCustomers();
    },
    [fetchCustomers],
  );

  const handleDeleteCustomer = useCallback(
    (id) => {
      console.log("Xóa khách hàng với ID:", id);
      setDeleteModalVisible(false);
      fetchCustomers();
    },
    [fetchCustomers],
  );

  return (
    <div>
      <Card className="transition-shadow h-fit-screen">
        <CustomerHeader />
        <Flex
          gap={16}
          vertical
          justify="space-between"
          style={{ height: "100%" }}
        >
          <Flex gap={8} justify="space-between" align="center">
            <Input.Search
              placeholder="Tìm kiếm khách hàng"
              onSearch={handleSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Flex gap={8}>
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => setAddModalVisible(true)}
              >
                Thêm khách hàng
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchCustomers}
                loading={loading}
              ></Button>
            </Flex>
          </Flex>

          {/* Bảng danh sách khách hàng */}
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            loading={loading}
            bordered
            scroll={{ x: 1000, y: "calc(100vh - 352px)" }}
            style={{ height: "100%" }}
            sticky
            onChange={handleTableChange}
            size="middle"
            locale={{ emptyText: "Không có dữ liệu" }}
          />

          {/* Các modal xử lý */}
          <AddCustomerModal
            visible={addModalVisible}
            onCancel={() => setAddModalVisible(false)}
            onAdd={handleAddCustomer}
          />

          {selectedCustomer && (
            <>
              <EditCustomerModal
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onEdit={handleEditCustomer}
                customer={selectedCustomer}
              />
              <DeleteCustomerModal
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onDelete={() => handleDeleteCustomer(selectedCustomer.id)}
                customer={selectedCustomer}
              />
            </>
          )}
        </Flex>
      </Card>
    </div>
  );
};

export default React.memo(CustomersMainPage);
