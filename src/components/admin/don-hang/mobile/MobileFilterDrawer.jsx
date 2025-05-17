import React from "react";
import { Drawer, Flex, Select, DatePicker, Button } from "antd";

const { Option } = Select;

const MobileFilterDrawer = ({
  open,
  onClose,
  selectedStatus,
  dateRange,
  onStatusChange,
  onDateChange,
}) => {
  return (
    <Drawer
      title="Bộ lọc"
      placement="right"
      open={open}
      onClose={onClose}
      width={300}
    >
      <Flex vertical gap={12}>
        <Select
          placeholder="Trạng thái"
          style={{ width: "100%" }}
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

        <DatePicker.RangePicker
          style={{ width: "100%" }}
          onChange={onDateChange}
          value={dateRange}
        />

        <Button type="primary" block onClick={onClose}>
          Áp dụng
        </Button>
      </Flex>
    </Drawer>
  );
};

export default MobileFilterDrawer;
