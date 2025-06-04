"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
    showSizeChanger: true,
  });

  // Memo hóa các tham số truyền vào API
  const apiParams = useMemo(() => {
    return {
      pageSize: 5,
      pageNumber: pagination.current - 1, // Giả sử API dùng pageNumber bắt đầu từ 0
      search: searchText,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      dateRange,
      sortBy,
      sortOrder,
    };
  }, [
    pagination.current,
    searchText,
    selectedStatus,
    dateRange,
    sortBy,
    sortOrder,
  ]);

  const fetchOrders = useCallback(
    async (isLoadMore = false) => {
      setLoading(true);
      try {
        // Nếu load thêm => giữ nguyên current, nếu không thì reset current về 1
        const params = {
          ...apiParams,
          pageNumber: isLoadMore ? pagination.current : 0,
        };
        const response = await getOrders(params);
        // Nếu load thêm: nối thêm, ngược lại thay thế
        setOrders((prev) =>
          isLoadMore
            ? [...prev, ...(response.content || [])]
            : response.content || [],
        );
        // Cập nhật lại pagination nếu có dữ liệu từ API
        setPagination((prev) => ({
          ...prev,
          total: response.totalElements || prev.total,
          current: isLoadMore ? prev.current + 1 : 1,
        }));
      } catch (error) {
        console.error("Error in fetchOrders:", error);
        message.error("Lỗi khi lấy danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    },
    [apiParams, pagination.current],
  );

  useEffect(() => {
    fetchOrders(false);
  }, [searchText, selectedStatus, sortBy, sortOrder, dateRange, fetchOrders]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchOrders(true);
    }
  }, [loading, hasMore, fetchOrders]);

  const handleTableChange = useCallback((newPagination, filters, sorter) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
    if (sorter?.field) {
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

  const handleReload = useCallback(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
  }, []);

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

  return (
    <>
      <Card className="transition-shadow h-fit-screen">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
        </div>
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
    </>
  );
};

export default React.memo(OrderMainPage);
