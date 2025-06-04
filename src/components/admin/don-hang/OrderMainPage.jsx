"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Flex, message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Components
import OrderHeader from "./OrderHeader";
import DesktopActionPanel from "./DesktopActionPanel";
import OrderContent from "./OrderContent";
import MobileControls from "./mobile/MobileControls";
import MobileMenuDrawer from "./mobile/MobileMenuDrawer";
import MobileFilterDrawer from "./mobile/MobileFilterDrawer";
import ModalManager from "./ModalManager";
import OrderDetailsModal from "./OrderDetailsModal";
import { getOrders } from "@requests/order";

// Configure dayjs
dayjs.extend(isBetween);

const OrderMainPage = () => {
  const isMobile = false;
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);

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

  const fetchOrders = useCallback(
    async (isLoadMore = false) => {
      setLoading(true);
      try {
        const params = {
          pageSize: 5,
          pageNumber: isLoadMore ? pagination.current : 0,
        };
        const response = await getOrders(params);
        setOrders(response.content || []);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    },
    [pagination.current],
  );

  useEffect(() => {
    fetchOrders(false);
  }, [searchText, selectedStatus, sortBy, sortOrder, dateRange, fetchOrders]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchOrders(true);
    }
  }, [loading, hasMore, fetchOrders]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
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
  }, []);

  const handleStatusFilter = useCallback((value) => {
    setSelectedStatus(value);
  }, []);

  const handleDateRangeChange = useCallback((dates) => {
    setDateRange(dates);
  }, []);

  // Fetch orders khi các bộ lọc hoặc sắp xếp thay đổi
  useEffect(() => {
    fetchOrders(false);
  }, [searchText, selectedStatus, sortBy, sortOrder, dateRange, fetchOrders]);

  const {
    menuDrawerOpen,
    setMenuDrawerOpen,
    filterDrawerOpen,
    setFilterDrawerOpen,
    isDetailsModalVisible,
    setIsDetailsModalVisible,
    selectedOrder,
    handleShowOrderDetails,
    handleExport,
  } = ModalManager();

  const handleReload = () => {
    fetchOrders(false);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  return (
    <div className="h-fit-screen">
      <Card className="transition-shadow mt-5">
        <Flex vertical gap={16}>
          {/* Header with title */}
          <OrderHeader
            isMobile={isMobile}
            setMenuDrawerOpen={setMenuDrawerOpen}
            setFilterDrawerOpen={setFilterDrawerOpen}
          />

          {/* Desktop Search and Actions */}
          {!isMobile && (
            <DesktopActionPanel
              searchText={searchText}
              selectedStatus={selectedStatus}
              dateRange={dateRange}
              onSearch={handleSearch}
              onStatusChange={handleStatusFilter}
              onDateChange={handleDateRangeChange}
              onExport={handleExport}
              onReload={handleReload}
            />
          )}

          {/* Mobile search bar */}
          {isMobile && (
            <MobileControls searchText={searchText} onSearch={handleSearch} />
          )}

          {/* Order content (table or list) */}
          <OrderContent
            isMobile={isMobile}
            orders={orders}
            loading={loading}
            pagination={pagination}
            hasMore={hasMore}
            onTableChange={handleTableChange}
            onLoadMore={handleLoadMore}
            onShowDetails={handleShowOrderDetails}
          />
        </Flex>
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
        onStatusChange={handleStatusFilter}
        onDateChange={handleDateRangeChange}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderMainPage;
