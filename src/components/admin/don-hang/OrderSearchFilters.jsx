import React from "react";
import { Flex, Input, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderSearchFilters = ({
  searchText,
  selectedStatus,
  dateRange,
  onSearch,
  onStatusChange,
  onDateChange,
}) => {
  return (
    <Flex gap={12} wrap="wrap">
      <Input
        placeholder="Tìm kiếm theo mã, tên khách hàng..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: 300 }}
        allowClear
      />

      <Select
        placeholder="Trạng thái"
        style={{ width: 150 }}
        value={selectedStatus}
        onChange={onStatusChange}
        allowClear
      >
        <Option value="all">Tất cả trạng thái</Option>
        <Option value="Pending">Chờ xử lý</Option>
        <Option value="Processing">Đang xử lý</Option>
        <Option value="Shipped">Đang giao</Option>
        <Option value="Delivered">Đã giao</Option>
        <Option value="Cancelled">Đã hủy</Option>
      </Select>

      <RangePicker onChange={onDateChange} value={dateRange} />
    </Flex>
  );
};

export default React.memo(OrderSearchFilters);
