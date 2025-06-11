"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, Flex, message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import OrderHeader from "./OrderHeader";
import DesktopActionPanel from "./DesktopActionPanel";
import OrderContent from "./OrderContent";
import ViewOrderModal from "./ViewOrderModal";
import { getOrders } from "@requests/order";

dayjs.extend(isBetween);

const OrderMainPage = () => {
  const isMobile = false;
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [dateRange, setDateRange] = useState(null);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  });

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const apiParams = useMemo(() => {
    return {
      pageSize: pagination.pageSize,
      pageNumber: pagination.current - 1,
      search: searchText,
      orderStatuses: selectedStatus.length > 0 ? selectedStatus : undefined,
      // Chuyển dateRange thành startDate và endDate theo định dạng YYYY-MM-DD
      startDate:
        dateRange && dateRange[0]
          ? dayjs(dateRange[0]).format("YYYY-MM-DD")
          : undefined,
      endDate:
        dateRange && dateRange[1]
          ? dayjs(dateRange[1]).format("YYYY-MM-DD")
          : undefined,
      sortBy,
      sortOrder,
    };
  }, [
    pagination.current,
    pagination.pageSize,
    searchText,
    selectedStatus,
    dateRange,
    sortBy,
    sortOrder,
  ]);

  const fetchOrders = async (isLoadMore = false) => {
    setLoading(true);
    try {
      // Nếu load thêm: giữ nguyên current, nếu không thì thiết lập trang hiện tại về 1 (0-index)
      const params = {
        ...apiParams,
        pageNumber: isLoadMore ? pagination.current : 0,
      };
      const response = await getOrders(params);
      // Nếu đang load thêm thì nối các đơn hàng, ngược lại thay thế
      setOrders((prev) =>
        isLoadMore
          ? [...prev, ...(response.content || [])]
          : response.content || [],
      );
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements || prev.total,
        current: isLoadMore ? prev.current + 1 : 1,
      }));
    } catch (error) {
      const errMsg = error?.response?.data?.error || "Lỗi không xác định";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const trimmed = value.trim();
    setSearchText(trimmed);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchOrders(false);
  };

  useEffect(() => {
    fetchOrders(false);
  }, [selectedStatus, sortBy, sortOrder, dateRange]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchOrders(true);
    }
  };

  const handleTableChange = (newPagination, filters, sorter) => {
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
  };

  const handleStatusFilter = (value) => {
    setSelectedStatus(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleReload = () => {
    fetchOrders(false);
  };

  return (
    <>
      <Card className="transition-shadow h-fit-screen">
        <OrderHeader
          isMobile={isMobile}
          setMenuDrawerOpen={() => {}}
          setFilterDrawerOpen={() => {}}
        />

        <Flex
          gap={16}
          vertical
          justify="space-between"
          style={{ height: "100%", flex: 1 }}
        >
          <DesktopActionPanel
            searchText={searchText}
            selectedStatus={selectedStatus}
            dateRange={dateRange}
            onSearch={handleSearch}
            onStatusChange={handleStatusFilter}
            onDateChange={handleDateRangeChange}
            onExport={() => {}}
            onReload={handleReload}
            setSearchText={setSearchText}
            loading={loading}
          />

          {/* Order content (table or list) */}
          <OrderContent
            isMobile={isMobile}
            orders={orders}
            loading={loading}
            pagination={pagination}
            hasMore={hasMore}
            onTableChange={handleTableChange}
            onLoadMore={handleLoadMore}
            setSelectedOrderId={setSelectedOrderId}
            setViewModalVisible={setViewModalVisible}
          />
        </Flex>
      </Card>

      {/* Order Details Modal */}
      <ViewOrderModal
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default React.memo(OrderMainPage);
