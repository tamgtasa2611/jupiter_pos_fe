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
    legend: { position: "left" },
    barStyle: {
      radius: [0, 4, 4, 0], // Rounded corners on right side
    },
    label: {
      text: "name",
      position: "left",
      textAlign: "left",
      dx: 5
    },
    interactions: [{ type: "element-active" }],
    animation: {
      appear: {
        animation: "fade-in",
        duration: 800,
      },
    },
    padding: [20, 20, 20, 20], // top, right, bottom, left
  };

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 my-4 md:my-0">
          <div className="flex items-center gap-2">
            <ShoppingOutlined />
            <span>Top 10 khách mua nhiều nhất</span>
          </div>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            className="w-full sm:w-32"
            popupMatchSelectWidth={false}
          >
            <Option value="today">Hôm nay</Option>
            <Option value="yesterday">Hôm qua</Option>
            <Option value="week">7 ngày qua</Option>
            <Option value="thisMonth">Tháng này</Option>
            <Option value="lastMonth">Tháng trước</Option>
          </Select>
        </div>
      }
      className="      transition-shadow w-full"
      style={{
        head: {
          padding: "16px",
        },
        body: {
          padding: "16px",
        },
      }}
    >
      <div className="h-64 sm:h-96">
        <Bar
          {...config}
        />
      </div>
    </Card>
  );
};

export default Top10Customers;
