import React from "react";
import { Flex, Input, Select, DatePicker, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderSearchFilters = ({
  searchText,
  setSearchText,
  selectedStatus,
  dateRange,
  onSearch,
  onStatusChange,
  onDateChange,
  loading,
}) => {
  return (
    <Flex gap={12} wrap="wrap">
      <Input.Search
        placeholder="Tìm kiếm theo tên khách hàng, email, số điện thoại..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        // Chỉ gọi API khi bấm Enter hoặc click nút tìm kiếm
        onSearch={onSearch}
        enterButton={
          loading ? (
            <Spin size="small" style={{ color: "white" }} />
          ) : (
            <SearchOutlined />
          )
        }
        readOnly={loading}
        style={{ width: 440 }}
        allowClear
        onClear={() => onSearch("")}
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
