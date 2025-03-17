"use client";

import React, { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Table, Space, Button, Input, Select, Tag } from "antd";
import {
  LikeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import OrderDetailsModal from "./OrderDetailsModal";
import OrderFilter from "./OrderFilter";

const { Option } = Select;

const OrderMainPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [searchText, statusFilter, sortBy, sortOrder]);

  const fetchOrders = async () => {
    setLoading(true);
    // Mock API call - replace with your actual API endpoint
    setTimeout(() => {
      let mockData = Array(15)
        .fill()
        .map((_, index) => ({
          id: index + 1,
          orderId: `DH${index + 1}`,
          customerName: `Khách hàng ${index + 1}`,
          orderDate: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
          totalAmount: Math.floor(Math.random() * 5000000),
          status: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"][
            Math.floor(Math.random() * 5)
          ],
        }));

      // Apply search filter
      if (searchText) {
        const searchTerm = searchText.toLowerCase();
        mockData = mockData.filter((order) => {
          return (
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.orderId.toLowerCase().includes(searchTerm)
          );
        });
      }

      // Apply status filter
      if (statusFilter) {
        mockData = mockData.filter((order) => order.status === statusFilter);
      }

      // Apply sorting
      if (sortBy) {
        mockData.sort((a, b) => {
          let comparison = 0;
          if (sortBy === "customerName") {
            comparison = a.customerName.localeCompare(b.customerName);
          } else if (sortBy === "orderDate") {
            comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
          } else if (sortBy === "totalAmount") {
            comparison = a.totalAmount - b.totalAmount;
          } else if (sortBy === "status") {
            comparison = a.status.localeCompare(b.status);
          }
          return sortOrder === "ascend" ? comparison : -comparison;
        });
      }

      setOrders(mockData);
      setLoading(false);
    }, 500);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: true,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: true,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => new Intl.NumberFormat("vi-VN").format(amount) + "đ",
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
          <Button type="text" onClick={() => showOrderDetails(record)}>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const showOrderDetails = (record) => {
    setSelectedOrder(record);
    setIsDetailsModalVisible(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
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

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={orders.length}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={new Intl.NumberFormat("vi-VN").format(totalRevenue) + "đ"}
              prefix={<LikeOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Đơn hàng đã giao" value={deliveredOrders} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách đơn hàng" style={{ marginTop: 20 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Button type="primary" icon={<ShoppingCartOutlined />}>
              Thêm đơn hàng
            </Button>
          </Col>
          <Col>
            <Space>
              <Input.Search
                placeholder="Tìm kiếm đơn hàng"
                onSearch={handleSearch}
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
              />
              <OrderFilter onStatusFilter={handleStatusFilter} />
            </Space>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      <OrderDetailsModal
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderMainPage;
