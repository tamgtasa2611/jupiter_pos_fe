import React from "react";
import { Flex } from "antd";
import OrderSearchFilters from "./OrderSearchFilters";
import OrderActions from "./OrderActions";

const DesktopActionPanel = ({
  searchText,
  selectedStatus,
  dateRange,
  onSearch,
  onStatusChange,
  onDateChange,
  onExport,
  onReload,
  setSearchText,
  loading,
}) => {
  return (
    <Flex gap={8} justify="space-between" align="center">
      <OrderSearchFilters
        searchText={searchText}
        setSearchText={setSearchText}
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onSearch={onSearch}
        onStatusChange={onStatusChange}
        onDateChange={onDateChange}
        loading={loading}
      />

      <OrderActions onExport={onExport} onReload={onReload} />
    </Flex>
  );
};

export default React.memo(DesktopActionPanel);
