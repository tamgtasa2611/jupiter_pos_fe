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
}) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      wrap="wrap"
      gap={16}
      className="mb-6"
    >
      <OrderSearchFilters
        searchText={searchText}
        selectedStatus={selectedStatus}
        dateRange={dateRange}
        onSearch={onSearch}
        onStatusChange={onStatusChange}
        onDateChange={onDateChange}
      />

      <OrderActions onExport={onExport} />
    </Flex>
  );
};

export default DesktopActionPanel;
