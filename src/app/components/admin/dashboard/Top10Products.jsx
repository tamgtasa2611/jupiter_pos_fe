import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Select } from "antd";
import { ShoppingOutlined, DollarOutlined, NumberOutlined } from "@ant-design/icons";
import { Bar } from "@ant-design/plots";

const { Title } = Typography;
const { Option } = Select;

const Top10Products = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [sortBy, setSortBy] = useState("revenue");
  const [productData, setProductData] = useState([]);

  // Format currency to Vietnamese format
  const formatVND = (value) => {
    return value / 1000000 + " tr";
  };

  // Generate dummy data for top selling products
  useEffect(() => {
    // In a real implementation, you would fetch this data from your API
    const products = [
      {
        name: "Bia 333 thùng 24 lon",
        category: "Đồ uống",
        quantity: 10,
        revenue: 15000000,
      },
      {
        name: "Coca Cola 24 lon",
        category: "Đồ uống",
        quantity: 20,
        revenue: 5000000,
      },
      {
        name: "Sữa Vinamilk 48 hộp",
        category: "Thực phẩm",
        quantity: 30,
        revenue: 10000000,
      },
      {
        name: "Mì Hảo Hảo thùng 30 gói",
        category: "Thực phẩm",
        quantity: 40,
        revenue: 8432000,
      },
      {
        name: "Dầu ăn Tường An 5L",
        category: "Gia vị",
        quantity: 45,
        revenue: 6000000,
      },
      {
        name: "Gạo ST25 túi 5kg",
        category: "Thực phẩm",
        quantity: 32,
        revenue: 7550000,
      },
      {
        name: "Nước giặt Omo 3.7kg",
        category: "Hóa phẩm",
        quantity: 20,
        revenue: 9000000,
      },
      {
        name: "Bánh Oreo gói 137g",
        category: "Bánh kẹo",
        quantity: 26,
        revenue: 4500000,
      },
      {
        name: "Dầu gội Head & Shoulders 625ml",
        category: "Hóa phẩm",
        quantity: 51,
        revenue: 11000000,
      },
      {
        name: "Kem đánh răng Colgate 230g",
        category: "Hóa phẩm",
        quantity: 42,
        revenue: 3800000,
      },
    ];

    // Sort by selected criteria
    if (sortBy === "revenue") {
      products.sort((a, b) => b.revenue - a.revenue);
    } else {
      products.sort((a, b) => b.quantity - a.quantity);
    }

    // Take top 10 and prepare data for visualization
    const top10 = products.slice(0, 10).map((product, index) => ({
      ...product,
      revenueFormatted: formatVND(product.revenue),
    }));

    setProductData(top10);
  }, [timeRange, sortBy]);

  // Bar chart configuration
  const config = {
    data: productData,
    yField: sortBy === "revenue" ? "revenue" : "quantity",
    xField: "revenueFormatted",
    isStack: false,
    isGroup: false,
    seriesField: "category",
    legend: { position: "top" },
    barStyle: {
      radius: [0, 4, 4, 0], // Rounded corners on right side
    },
    label: {
      text: "name",
      position: "bottom",
    },
    colorField: "category",
    color: ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#722ed1"],
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
          <span>Top 10 hàng bán chạy</span>
        </Space>
      }
      className="shadow-sm hover:shadow-md transition-shadow w-full"
      extra={
        <Space>
          <Select
            value={sortBy}
            onChange={setSortBy}
            className="w-52"
            options={[
              {
                value: "revenue",
                label: (
                  <Space>
                    <DollarOutlined />
                    <span>Theo doanh thu thuần</span>
                  </Space>
                ),
              },
              {
                value: "quantity",
                label: (
                  <Space>
                    <NumberOutlined />
                    <span>Theo số lượng</span>
                  </Space>
                ),
              },
            ]}
          />

          <Select value={timeRange} onChange={setTimeRange} className="w-32">
            <Option value="today">Hôm nay</Option>
            <Option value="yesterday">Hôm qua</Option>
            <Option value="week">7 ngày qua</Option>
            <Option value="thisMonth">Tháng này</Option>
            <Option value="lastMonth">Tháng trước</Option>
          </Select>
        </Space>
      }
    >
      <div className="h-96">
        <Bar {...config} />
      </div>
    </Card>
  );
};

export default Top10Products;
