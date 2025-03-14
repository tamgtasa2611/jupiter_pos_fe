import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Select, Statistic, Segmented } from "antd";
import { Column } from "@ant-design/plots";

const { Title, Text } = Typography;
const { Option } = Select;

const SalesSummary = () => {
  // States for controlling data views
  const [timeRange, setTimeRange] = useState("today");
  const [viewType, setViewType] = useState("hour");
  const [chartData, setChartData] = useState([]);

  // Dummy total net revenue
  const totalNetRevenue = 551280000;

  // Format currency to Vietnamese format
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  // Generate dummy data based on selected time range and view type
  useEffect(() => {
    let data = [];

    if (timeRange === "today" || timeRange === "yesterday") {
      // Hourly data for today or yesterday
      if (viewType === "hour") {
        for (let i = 8; i <= 21; i++) {
          const hour = `${i}:00`;
          data.push({
            time: hour,
            revenue: Math.floor(Math.random() * 50000000) + 10000000,
          });
        }
      } else {
        // Single day can't show daily or weekly view
        data = [
          { time: "8:00", revenue: 12000000 },
          { time: "10:00", revenue: 25000000 },
          { time: "12:00", revenue: 31000000 },
          { time: "14:00", revenue: 18000000 },
          { time: "16:00", revenue: 26000000 },
          { time: "18:00", revenue: 32000000 },
          { time: "20:00", revenue: 21000000 },
        ];
      }
    } else if (timeRange === "week") {
      // Data for last 7 days
      if (viewType === "day") {
        const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
        for (let i = 0; i < 7; i++) {
          data.push({
            time: days[i],
            revenue: Math.floor(Math.random() * 80000000) + 20000000,
          });
        }
      } else if (viewType === "hour") {
        // By hour for the week (average by hour)
        for (let i = 8; i <= 21; i++) {
          const hour = `${i}:00`;
          data.push({
            time: hour,
            revenue: Math.floor(Math.random() * 60000000) + 15000000,
          });
        }
      } else {
        // By weekday (aggregated)
        data = [
          { time: "Thứ 2", revenue: 75000000 },
          { time: "Thứ 3", revenue: 62000000 },
          { time: "Thứ 4", revenue: 81000000 },
          { time: "Thứ 5", revenue: 92000000 },
          { time: "Thứ 6", revenue: 105000000 },
          { time: "Thứ 7", revenue: 114000000 },
          { time: "Chủ nhật", revenue: 78000000 },
        ];
      }
    } else {
      // This month or last month
      if (viewType === "day") {
        // Daily data for the month
        for (let i = 1; i <= 30; i++) {
          data.push({
            time: `${i}/3`,
            revenue: Math.floor(Math.random() * 90000000) + 10000000,
          });
        }
      } else if (viewType === "weekday") {
        // By weekday for the month
        data = [
          { time: "Thứ 2", revenue: 285000000 },
          { time: "Thứ 3", revenue: 262000000 },
          { time: "Thứ 4", revenue: 291000000 },
          { time: "Thứ 5", revenue: 302000000 },
          { time: "Thứ 6", revenue: 345000000 },
          { time: "Thứ 7", revenue: 384000000 },
          { time: "Chủ nhật", revenue: 298000000 },
        ];
      } else {
        // By hour for the month (average)
        for (let i = 8; i <= 21; i++) {
          const hour = `${i}:00`;
          data.push({
            time: hour,
            revenue: Math.floor(Math.random() * 180000000) + 70000000,
          });
        }
      }
    }

    setChartData(data);
  }, [timeRange, viewType]);

  // Configure the bar chart
  const config = {
    data: chartData,
    xField: "time",
    yField: "revenue",
    columnWidthRatio: 0.6,
    label: {
      position: "top",
      style: {
        fill: "#aaa",
        fontSize: 12,
      },
      formatter: (datum) => `₫${formatCurrency(datum.revenue)}`.slice(0, -3) + "K",
    },
    tooltip: {
      formatter: (datum) => {
        return { name: "Doanh thu", value: `₫${formatCurrency(datum.revenue)}` };
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `₫${formatCurrency(v / 1000000)}Tr`,
      },
    },
    meta: {
      revenue: {
        alias: "Doanh thu",
      },
    },
    color: "#1677ff",
    animation: {
      appear: {
        duration: 1000,
        easing: "easeQuadIn",
      },
    },
    // Add gradient fill to the columns
    columnStyle: {
      fill: "l(90) 0:#1677ff 1:#58a9ff",
      radius: [4, 4, 0, 0], // Rounded top corners
    },
  };

  // Disable day view for today/yesterday since it doesn't make sense
  const getViewOptions = () => {
    if (timeRange === "today" || timeRange === "yesterday") {
      return [{ label: "Theo giờ", value: "hour" }];
    }

    return [
      { label: "Theo ngày", value: "day" },
      { label: "Theo giờ", value: "hour" },
      { label: "Theo thứ", value: "weekday" },
    ];
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Title level={4}>Doanh thu thuần</Title>
          <Statistic
            value={formatCurrency(totalNetRevenue)}
            prefix="₫"
            valueStyle={{ color: "#3f8600", fontSize: "28px" }}
          />
        </Col>

        <Col
          xs={24}
          md={12}
          className="flex flex-col md:flex-row md:items-center md:justify-end gap-2"
        >
          <Select
            value={timeRange}
            className="w-full md:w-40"
            onChange={(value) => {
              setTimeRange(value);
              // Reset view type if necessary
              if ((value === "today" || value === "yesterday") && viewType !== "hour") {
                setViewType("hour");
              }
            }}
          >
            <Option value="today">Hôm nay</Option>
            <Option value="yesterday">Hôm qua</Option>
            <Option value="week">7 ngày qua</Option>
            <Option value="thisMonth">Tháng này</Option>
            <Option value="lastMonth">Tháng trước</Option>
          </Select>

          <Segmented options={getViewOptions()} value={viewType} onChange={setViewType} />
        </Col>

        <Col xs={24} className="h-80">
          <Column {...config} />
        </Col>
      </Row>
    </Card>
  );
};

export default SalesSummary;
