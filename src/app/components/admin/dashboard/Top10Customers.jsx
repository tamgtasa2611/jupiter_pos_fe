import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Select } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { Bar } from "@ant-design/plots";

const { Title } = Typography;
const { Option } = Select;

const Top10Customers = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [customerData, setCustomerData] = useState([]);

  // Format currency to Vietnamese format
  const formatVND = (value) => {
    return value / 1000000 + " tr";
  };

  // Generate dummy data for top selling customers
  useEffect(() => {
    // In a real implementation, you would fetch this data from your API
    const customers = [
      {
        name: "Nguyen Van A",
        buyingAmount: 15000000,
      },
      {
        name: "Nguyen Van B",
        buyingAmount: 5000000,
      },
      {
        name: "Nguyen Van C",
        buyingAmount: 10000000,
      },
      {
        name: "Nguyen Van D",
        buyingAmount: 8432000,
      },
      {
        name: "Nguyen Van E",
        buyingAmount: 6000000,
      },
      {
        name: "Nguyen Van F",
        buyingAmount: 7550000,
      },
      {
        name: "Nguyen Van G",
        buyingAmount: 9000000,
      },
      {
        name: "Nguyen Van H",
        buyingAmount: 4500000,
      },
      {
        name: "Nguyen Van I",
        buyingAmount: 11000000,
      },
      {
        name: "Nguyen Van K",
        buyingAmount: 3800000,
      },
    ];

    // Sort by selected criteria
    customers.sort((a, b) => b.buyingAmount - a.buyingAmount);

    // Take top 10 and prepare data for visualization
    const top10 = customers.slice(0, 10).map((customer, index) => ({
      ...customer,
      buyingAmountFormatted: formatVND(customer.buyingAmount),
      index: index + 1,
    }));

    setCustomerData(top10);
  }, [timeRange]);

  // Bar chart configuration
  const config = {
    data: customerData,
    yField: "buyingAmount",
    xField: "index",
    isStack: false,
    isGroup: false,
    legend: { position: "top" },
    barStyle: {
      radius: [0, 4, 4, 0], // Rounded corners on right side
    },
    label: {
      text: "name",
      textAlign: "left"
    },
    interactions: [{ type: "element-active" }],
    animation: {
      appear: {
        animation: "fade-in",
        duration: 800,
      },
    },
    padding: [20, 100, 30, 120], // top, right, bottom, left
  };

  return (
    <Card
      title={
        <Space>
          <ShoppingOutlined />
          <span>Top 10 khách mua nhiều nhất</span>
        </Space>
      }
      className="shadow-sm hover:shadow-md transition-shadow w-full"
      extra={
        <Select value={timeRange} onChange={setTimeRange} className="w-32">
          <Option value="today">Hôm nay</Option>
          <Option value="yesterday">Hôm qua</Option>
          <Option value="week">7 ngày qua</Option>
          <Option value="thisMonth">Tháng này</Option>
          <Option value="lastMonth">Tháng trước</Option>
        </Select>
      }
    >
      <div className="h-96">
        <Bar {...config} />
      </div>
    </Card>
  );
};

export default Top10Customers;
