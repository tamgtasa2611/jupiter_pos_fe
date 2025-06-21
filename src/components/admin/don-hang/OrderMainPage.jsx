"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, Flex, message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import OrderHeader from "./OrderHeader";
import DesktopActionPanel from "./DesktopActionPanel";
import OrderContent from "./OrderContent";
import ViewOrderModal from "./order-details/ViewOrderModal";
import EditOrderModal from "./order-details/EditOrderModal";
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

  const [sortBy, setSortBy] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("DESC");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  });

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

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
      sortDirection: sortDirection === "ascend" ? "ASC" : "DESC",
    };
  }, [
    pagination.current,
    pagination.pageSize,
    searchText,
    selectedStatus,
    dateRange,
    sortBy,
    sortDirection,
  ]);

  const fetchOrders = async (isLoadMore = false, targetPage = null) => {
    setLoading(true);
    try {
      // Xác định trang cần load
      let pageNumber;
      if (targetPage !== null) {
        pageNumber = targetPage - 1; // Convert từ 1-based sang 0-based
      } else if (isLoadMore) {
        pageNumber = pagination.current; // Trang tiếp theo khi load more
      } else {
        pageNumber = pagination.current - 1; // Giữ nguyên trang hiện tại thay vì reset về 0
      }

      const params = {
        ...apiParams,
        pageNumber,
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
        // Chỉ update current khi có targetPage hoặc reset về 1
        current: targetPage !== null ? targetPage : prev.current,
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
  }, [selectedStatus, sortBy, sortDirection, dateRange]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchOrders(true);
    }
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    if (sorter?.field) {
      setSortBy(sorter.field);
      setSortDirection(sorter.order);
    } else {
      setSortBy("orderDate");
      setSortDirection("DESC");
    }
    // Xử lý thay đổi pagination
    if (
      newPagination.current !== pagination.current ||
      newPagination.pageSize !== pagination.pageSize
    ) {
      setPagination((prev) => ({
        ...prev,
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      }));
      fetchOrders(false, newPagination.current);
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
      <Card className="transition-shadow mh-fit-screen">
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
            setEditModalVisible={setEditModalVisible}
          />
        </Flex>
      </Card>

      {/* Order Details Modal */}
      <ViewOrderModal
        visible={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          fetchOrders(false);
        }}
        orderId={selectedOrderId}
        onEdit={() => {
          setViewModalVisible(false);
          setEditModalVisible(true);
        }}
      />

      {/* Edit Order Modal */}
      <EditOrderModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          fetchOrders(false);
        }}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default React.memo(OrderMainPage);
