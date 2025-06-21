import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Select, Statistic, Segmented } from "antd";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { getNetReveneues } from "@requests/statistic";

const { Title, Text } = Typography;
const { Option } = Select;

const TIME_OPTIONS = [
  {
    label: "7 ngày gần nhất",
    value: "7days",
    getRange: () => ({
      startTime: dayjs().subtract(6, "day").startOf("day").toISOString(),
      endTime: dayjs().endOf("day").toISOString(),
    }),
  },
  ...Array.from({ length: 12 }).map((_, i) => {
    const month = dayjs().subtract(i, "month");
    return {
      label: month.format("MM/YYYY"),
      value: `month-${month.format("YYYY-MM")}`,
      getRange: () => ({
        startTime: month.startOf("month").toISOString(),
        endTime: month.endOf("month").toISOString(),
      }),
    };
  }),
];

const SalesSummary = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [viewType, setViewType] = useState("hour");
  const [chartData, setChartData] = useState([]);
  const [sortBy, setSortBy] = useState("day");
  const [loading, setLoading] = useState(true);

  const totalNetRevenue = 551280000;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const fetchCustomerData = async (range) => {
    setLoading(true);
    try {
      const { startTime, endTime } = range;
      const customer = await getNetReveneues({ startTime, endTime });
      const sortField = sortBy === "totalSpent" ? "totalSpent" : "totalOrders";
      const top10 = (customer || [])
        .sort((a, b) => (b[sortField] || 0) - (a[sortField] || 0))
        .slice(0, 10)
        .map((customer, index) => ({
          ...customer,
          totalSpentFormatted: formatVND(customer.totalSpent),
          index: index + 1,
        }));
      setCustomerData(top10);
      
    } catch (error) {
      setCustomerData([]);
    }
    setLoading(false);
  }; 

  const config = {
    data: chartData,
    xField: "time",
    yField: "revenueFormatted",
    columnWidthRatio: 0.6,
    label: {
      text: "revenueFormatted",
      position: "top",
      style: {
        fill: "#000",
        fontSize: 12,
        dy: 5,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return { name: "Doanh thu", value: `${datum.revenueFormatted}` };
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
        text: "revenueFormatted",
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

    columnStyle: {
      fill: "l(90) 0:#1677ff 1:#58a9ff",
      radius: [4, 4, 0, 0],
    },
  };

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
    <Card className="transition-shadow">
      <Row gutter={[16, 16]} className="w-full">
        <Col xs={24} md={12}>
          <Title level={4}>Doanh thu thuần</Title>
          <Statistic
            value={formatCurrency(totalNetRevenue)}
            prefix="₫"
            valueStyle={{ color: "#3f8600", fontSize: "28px" }}
          />
        </Col>
        <Col xs={24} md={12}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-2">
            <Select
              value={timeRange}
              className="w-full md:w-40"
              onChange={(value) => {
                setTimeRange(value);

                if (
                  (value === "today" || value === "yesterday") &&
                  viewType !== "hour"
                ) {
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

            <Segmented
              options={getViewOptions()}
              value={viewType}
              onChange={setViewType}
            />
          </div>
        </Col>
        <Col xs={24} className="h-80">
          <Column {...config} />
        </Col>
      </Row>
    </Card>
  );
};

export default SalesSummary;
