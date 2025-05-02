"use client";

import React from "react";
import { Card, Flex } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Custom hooks
import useOrderData from "@hooks/don-hang/useOrderData";
import useResponsive from "@hooks/don-hang/useResponsive";

// Components
import OrderHeader from "./OrderHeader";
import DesktopActionPanel from "./DesktopActionPanel";
import OrderContent from "./OrderContent";
import MobileControls from "./MobileControls";
import MobileMenuDrawer from "./MobileMenuDrawer";
import MobileFilterDrawer from "./MobileFilterDrawer";
import ModalManager from "./ModalManager";
import OrderDetailsModal from "./OrderDetailsModal";

// Configure dayjs
dayjs.extend(isBetween);

const OrderMainPage = () => {
  // Custom hooks
  const { isMobile } = useResponsive();

  const {
    orders,
    loading,
    hasMore,
    searchText,
    selectedStatus,
    dateRange,
    pagination,
    handleSearch,
    handleStatusFilter,
    handleDateRangeChange,
    handleLoadMore,
    handleTableChange,
  } = useOrderData();

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
