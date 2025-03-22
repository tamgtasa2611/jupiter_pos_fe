"use client";

import React from "react";
import { Select } from "antd";

const { Option } = Select;

const OrderFilter = ({ onStatusFilter }) => {
  return (
    <Select
      placeholder="Lọc theo trạng thái"
      onChange={onStatusFilter}
      style={{ width: 150 }}
      allowClear
    >
      <Option value="Pending">Pending</Option>
      <Option value="Processing">Processing</Option>
      <Option value="Shipped">Shipped</Option>
      <Option value="Delivered">Delivered</Option>
      <Option value="Cancelled">Cancelled</Option>
    </Select>
  );
};

export default OrderFilter;
