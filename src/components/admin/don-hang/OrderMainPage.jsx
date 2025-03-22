"use client";

import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { Card, Button, Flex, Typography, DatePicker } from "antd";
import {
  FilterOutlined,
  MenuOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import OrderDetailsModal from "./OrderDetailsModal";
import { debounce } from "lodash";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import OrderTable from "./OrderTable";
import OrderList from "./OrderList";
import OrderSearchFilters from "./OrderSearchFilters";
import OrderActions from "./OrderActions";
import MobileMenuDrawer from "./MobileMenuDrawer";
import MobileFilterDrawer from "./MobileFilterDrawer";
import MobileHeader from "./MobileHeader";
import Link from "next/link";

dayjs.extend(isBetween);

const { Title } = Typography;

const OrderMainPage = () => {
  // State management
  const [isMobile, setIsMobile] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);

  // Order detail modal
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sorting
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    position: ["bottomCenter"],
    showSizeChanger: true,
  });

  // Debounced search handler
  const debouncedSetSearchText = useCallback(
    debounce((value) => {
      setSearchText(value);
    }, 300),
    []
  );

  // Check for mobile screen
  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Fetch orders
  useEffect(() => {
    // Only fetch on filter/sort changes, not for infinite scroll
    fetchOrders(false);
  }, [searchText, selectedStatus, sortBy, sortOrder, dateRange]);

  const fetchOrders = (isLoadingMore = false) => {
    setLoading(true);

    setTimeout(() => {
      // Your existing logic to generate mock data
      let mockData = Array(100)
        .fill()
        .map((_, index) => ({
          id: index + 1,
          orderId: `DH${String(index + 1).padStart(6, "0")}`,
          customerName: `Khách hàng ${index + 1}`,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          orderDate: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
          totalAmount: Math.floor(Math.random() * 5000000),
          status: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"][
            Math.floor(Math.random() * 5)
          ],
          phone: `09${Math.floor(Math.random() * 100000000)}`,
          address: `Địa chỉ ${index + 1}, Phường X, Quận Y, TP.HCM`,
          items: Math.floor(Math.random() * 10) + 1,
        }));

      // Apply search filter
      if (searchText) {
        const searchTerm = searchText.toLowerCase();
        mockData = mockData.filter((order) => {
          return (
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.orderId.toLowerCase().includes(searchTerm) ||
            order.phone.includes(searchTerm)
          );
        });
      }

      // Apply status filter
      if (selectedStatus !== "all") {
        mockData = mockData.filter((order) => order.status === selectedStatus);
      }

      // Apply date range filter
      if (dateRange && dateRange[0] && dateRange[1]) {
        mockData = mockData.filter((order) => {
          const orderDate = dayjs(order.orderDate, "DD/MM/YYYY");
          return orderDate.isBetween(dateRange[0], dateRange[1], null, "[]");
        });
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

      // Handle pagination or infinite scroll
      const pageSize = 10;
      const total = mockData.length;

      // Slice data properly for pagination or infinite scroll
      let result;
      if (isLoadingMore) {
        const start = orders.length;
        const end = start + pageSize;
        result = mockData.slice(start, end);

        // Append new data to existing orders
        setOrders((prevOrders) => [...prevOrders, ...result]);
        setHasMore(orders.length + result.length < total);
      } else {
        // Initial load or filter change
        const start = 0;
        const end = pageSize;
        result = mockData.slice(start, end);

        setOrders(result);
        setHasMore(result.length < total);

        // Update pagination for desktop view
        setPagination((prev) => ({
          ...prev,
          current: 1,
          total: total,
        }));
      }

      setLoading(false);
    }, 500);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchOrders(true);
    }
  };

  // Event handlers
  const handleShowOrderDetails = (record) => {
    setSelectedOrder(record);
    setIsDetailsModalVisible(true);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

    if (sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order);
    } else {
      setSortBy(null);
      setSortOrder(null);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleStatusFilter = (value) => {
    setSelectedStatus(value);
  };

  const handleExport = (type) => {
    console.log(`Exporting as ${type}`);
    // Implement export logic
  };

  const handleSearch = (value) => {
    debouncedSetSearchText(value);
  };

  return (
    <div className="min-h-screen">
      <Card className="transition-shadow mt-5">
        <Flex justify="space-between" align="center" wrap="wrap" style={{ marginBottom: 16 }}>
          <div className="">
            <Title level={4} style={{ margin: 0 }}>
              {isMobile && (
                <Button
                  size="large"
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMenuDrawerOpen(true)}
                  style={{ marginRight: 8 }}
                />
              )}
              Đơn hàng
            </Title>
          </div>

          {/* Mobile Filter Button */}
          {isMobile && (
            <Flex gap="middle">
              <Button size="large" icon={<SortAscendingOutlined />} onClick={() => {}}></Button>
              <Button
                size="large"
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerOpen(true)}
              ></Button>
            </Flex>
          )}

          {/* Action bar - Desktop */}
          {!isMobile && (
            <Flex justify="space-between" align="center" wrap="wrap" gap={16} className="mb-6">
              <OrderSearchFilters
                searchText={searchText}
                selectedStatus={selectedStatus}
                dateRange={dateRange}
                onSearch={handleSearch}
                onStatusChange={handleStatusFilter}
                onDateChange={handleDateRangeChange}
              />

              <OrderActions onExport={handleExport} />
            </Flex>
          )}
        </Flex>

        {/* Mobile Search Bar */}
        {isMobile && <MobileHeader searchText={searchText} onSearch={handleSearch} />}

        {/* Order Table for Desktop */}
        {!isMobile && (
          <OrderTable
            orders={orders}
            loading={loading}
            pagination={pagination}
            onTableChange={handleTableChange}
            onShowDetails={handleShowOrderDetails}
          />
        )}

        {/* Order List for Mobile */}
        {isMobile && (
          <OrderList
            orders={orders}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onShowDetails={handleShowOrderDetails}
          />
        )}
      </Card>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        open={menuDrawerOpen}
        onClose={() => setMenuDrawerOpen(false)}
        onExport={handleExport}
      />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onStatusChange={setSelectedStatus}
        onDateChange={handleDateRangeChange}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        order={selectedOrder}
      />

      {/* Mobile Add Button */}
      <Link href="/admin/ban-hang">
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          className="right-4 shadow-sm"
          style={{
            zIndex: 2,
            position: "fixed",
            bottom: "80px",
            width: "48px",
            height: "48px",
            display: isMobile ? "block" : "none",
          }}
        />
      </Link>
    </div>
  );
};

export default OrderMainPage;
