"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Space,
  Avatar,
  Empty,
  Flex,
  Button,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { getInactiveCustomers } from "@/requests/statistic";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Title, Text } = Typography;

const InactiveCustomers = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [sortInfo, setSortInfo] = useState({
    sortBy: "daysSinceLastOrder",
    sortDirection: "desc",
  });

  const fetchCustomersData = async (sortBy, sortDirection) => {
    setLoading(true);
    try {
      const response = await getInactiveCustomers({
        sortBy: sortBy || sortInfo.sortBy,
        sortDirection: sortDirection || sortInfo.sortDirection,
      });
      setCustomers(response);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const handleRefresh = () => {
    fetchCustomersData(sortInfo.sortBy, sortInfo.sortDirection);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      const newSortBy = sorter.field;
      const newSortDirection = sorter.order === "ascend" ? "asc" : "desc";

      setSortInfo({
        sortBy: newSortBy,
        sortDirection: newSortDirection,
      });

      fetchCustomersData(newSortBy, newSortDirection);
    }
  };

  const getDaysSinceColor = (days) => {
    if (days >= 90) return "red";
    if (days >= 30) return "orange";
    if (days >= 14) return "gold";
    if (days >= 7) return "green";
    return "blue";
  };

  const getDaysStatus = (days) => {
    if (days >= 90) return { text: "Cần chăm sóc", emoji: "🔴" };
    if (days >= 30) return { text: "Cần liên hệ", emoji: "🟠" };
    if (days >= 14) return { text: "Theo dõi", emoji: "🟡" };
    if (days >= 7) return { text: "Bình thường", emoji: "🟢" };
    return { text: "Rất tốt", emoji: "💚" };
  };

  const getPriorityLevel = (days, totalSpent) => {
    if (days >= 90 && totalSpent >= 5000000) {
      return { level: "Khẩn cấp", color: "red" };
    }
    if (days >= 90) return { level: "Rất cao", color: "red" };
    if (days >= 30 && totalSpent >= 3000000) {
      return { level: "Cao", color: "orange" };
    }
    if (days >= 30) return { level: "Trung bình cao", color: "orange" };
    if (days >= 14) return { level: "Trung bình", color: "gold" };
    return { level: "Thấp", color: "green" };
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <Text strong style={{ color: "#1890ff" }}>
          {index + 1}
        </Text>
      ),
    },
    {
      title: "Thông tin khách hàng",
      key: "customer",
      width: 280,
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div>
            <div>
              <Text strong style={{ fontSize: 14 }}>
                {record.customerName}
              </Text>
            </div>
            <div>
              <Space size={4}>
                <PhoneOutlined style={{ color: "#666", fontSize: 12 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.phone}
                </Text>
              </Space>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Lần mua cuối",
      dataIndex: "lastOrderDate",
      key: "lastOrderDate",
      width: 150,
      align: "center",
      render: (date) => (
        <div>
          <div>
            <CalendarOutlined style={{ color: "#1890ff", marginRight: 4 }} />
            <Text>{dayjs(date).format("DD/MM/YYYY")}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).fromNow()}
          </Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "daysSinceLastOrder",
      key: "daysSinceLastOrder",
      width: 140,
      align: "center",
      sorter: true,
      render: (days) => {
        const status = getDaysStatus(days);
        return (
          <div>
            <Tag
              color={getDaysSinceColor(days)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: "4px 8px",
                marginBottom: 4,
              }}
            >
              {days} ngày trước
            </Tag>
            <div style={{ fontSize: 11 }}>
              {status.emoji} {status.text}
            </div>
          </div>
        );
      },
    },
    {
      title: "Thống kê mua hàng",
      key: "stats",
      width: 160,
      align: "center",
      dataIndex: "totalSpent",
      sorter: true,
      render: (_, record) => (
        <div>
          <div>
            <ShoppingOutlined style={{ color: "#52c41a", marginRight: 4 }} />
            <Text strong>{record.totalOrders}</Text>
            <Text type="secondary"> đơn hàng</Text>
          </div>
          <div>
            <Text style={{ color: "#ff4d4f", fontWeight: 500 }}>
              {new Intl.NumberFormat("vi-VN").format(record.totalSpent)}đ
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Mức độ ưu tiên",
      key: "priority",
      width: 120,
      align: "center",
      render: (_, record) => {
        const priority = getPriorityLevel(
          record.daysSinceLastOrder,
          record.totalSpent,
        );
        return (
          <Tag color={priority.color} style={{ fontWeight: 500 }}>
            {priority.level}
          </Tag>
        );
      },
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <Flex justify="space-between" align="start">
          <div>
            <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
              📊 Top 10 khách hàng inactive
            </Title>
            <Text type="secondary">
              Danh sách khách hàng được sắp xếp theo thời gian không mua hàng
            </Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
        </Flex>

        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#f9f9f9",
            borderRadius: 6,
          }}
        >
          <Text strong style={{ marginRight: 16 }}>
            Phân loại:
          </Text>
          <Space wrap>
            <span>🔴 ≥90 ngày: Cần chăm sóc</span>
            <span>🟠 ≥30 ngày: Cần liên hệ</span>
            <span>🟡 ≥14 ngày: Theo dõi</span>
            <span>🟢 ≥7 ngày: Bình thường</span>
            <span>💚 {"<7 ngày: Rất tốt"}</span>
          </Space>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={customers}
        loading={loading}
        rowKey="id"
        pagination={false}
        onChange={handleTableChange}
        size="middle"
        scroll={{ x: 1000 }}
        locale={{
          emptyText: (
            <Empty
              description="Không có dữ liệu khách hàng"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
    </Card>
  );
};

export default InactiveCustomers;
