"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
} from "antd";
import {
  LikeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";

const { Option } = Select;

const CustomersMainPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [searchText, sortBy, sortOrder]);

  const fetchCustomers = async () => {
    setLoading(true);
    // Mock API call - replace with your actual API endpoint
    setTimeout(() => {
      let mockData = Array(15)
        .fill()
        .map((_, index) => ({
          id: index + 1,
          name: `Khách hàng ${index + 1}`,
          phone: `090${Math.floor(Math.random() * 10000000)}`,
          email: `customer${index + 1}@example.com`,
          address: `Địa chỉ ${index + 1}`,
          totalOrders: Math.floor(Math.random() * 50),
          totalSpent: Math.floor(Math.random() * 5000000),
          tags: ["VIP", "Loyal", "New"][Math.floor(Math.random() * 3)],
        }));

      // Apply search filter
      if (searchText) {
        const searchTerm = searchText.toLowerCase();
        mockData = mockData.filter((customer) => {
          return (
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.phone.includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.address.toLowerCase().includes(searchTerm)
          );
        });
      }

      // Apply sorting
      if (sortBy) {
        mockData.sort((a, b) => {
          let comparison = 0;
          if (sortBy === "name") {
            comparison = a.name.localeCompare(b.name);
          } else if (sortBy === "totalOrders") {
            comparison = a.totalOrders - b.totalOrders;
          } else if (sortBy === "totalSpent") {
            comparison = a.totalSpent - b.totalSpent;
          }
          return sortOrder === "ascend" ? comparison : -comparison;
        });
      }

      setCustomers(mockData);
      setLoading(false);
    }, 500);
  };

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      sorter: true, // Enable sorter for this column
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tổng đơn hàng",
      dataIndex: "totalOrders",
      key: "totalOrders",
      sorter: true, // Enable sorter for this column
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (spent) => new Intl.NumberFormat("vi-VN").format(spent) + "đ",
      sorter: true, // Enable sorter for this column
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          <Tag color="green">{tags}</Tag>
        </>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedCustomer(record);
              setEditModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedCustomer(record);
              setDeleteModalVisible(true);
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddCustomer = (newCustomer) => {
    // In a real app, you would make an API call here
    console.log("Adding new customer:", newCustomer);
    setAddModalVisible(false);
    fetchCustomers(); // Refresh data
  };

  const handleEditCustomer = (updatedCustomer) => {
    // In a real app, you would make an API call here
    console.log("Updating customer:", updatedCustomer);
    setEditModalVisible(false);
    fetchCustomers(); // Refresh data
  };

  const handleDeleteCustomer = (id) => {
    // In a real app, you would make an API call here
    console.log("Deleting customer with ID:", id);
    setDeleteModalVisible(false);
    fetchCustomers(); // Refresh data
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order);
    } else {
      setSortBy(null);
      setSortOrder(null);
    }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số khách hàng"
              value={customers.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={customers.reduce(
                (sum, customer) => sum + customer.totalOrders,
                0,
              )}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng chi tiêu"
              value={customers.reduce(
                (sum, customer) => sum + customer.totalSpent,
                0,
              )}
              prefix={<LikeOutlined />}
              formatter={(value) =>
                new Intl.NumberFormat("vi-VN").format(value) + "đ"
              }
            />
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách khách hàng" style={{ marginTop: 20 }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => setAddModalVisible(true)}
            >
              Thêm khách hàng
            </Button>
          </Col>
          <Col>
            <Input.Search
              placeholder="Tìm kiếm khách hàng"
              onSearch={handleSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

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
    </div>
  );
};

export default CustomersMainPage;
