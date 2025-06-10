import React from "react";
import { Flex, Input, Select, DatePicker, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ORDER_STATUS_MAP } from "@constants/order";
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
        placeholder="Tìm kiếm theo tên khách hàng, số tiền..."
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
        style={{ width: 360 }}
        allowClear
        onClear={() => onSearch("")}
      />

      <Select
        mode="multiple"
        placeholder="Trạng thái"
        style={{ width: "360px" }}
        value={selectedStatus}
        onChange={onStatusChange}
        allowClear
      >
        {Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>

      <RangePicker
        onChange={(dates, dateStrings) => {
          // Nếu người dùng chỉ chọn 1 ngày, dates sẽ có độ dài 1 hoặc [moment, null]
          if (dates && (!dates[1] || dates.length === 1)) {
            onDateChange([dates[0], null]);
          } else {
            onDateChange(dates);
          }
        }}
        value={dateRange}
        allowClear
      />
    </Flex>
  );
};

export default React.memo(OrderSearchFilters);
