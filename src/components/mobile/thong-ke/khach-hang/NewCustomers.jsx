"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Typography,
  Space,
  Spin,
  Empty,
  Statistic,
  Row,
  Col,
} from "antd";

import {
  UserAddOutlined,
  CalendarOutlined,
  TrophyOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/plots";
import { getNewCustomers } from "@/requests/statistic";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const TIME_OPTIONS = [
  {
    label: "7 ngày qua",
    value: "last7Days",
    getRange: () => ({
      startTime: dayjs().subtract(7, "days").toISOString(),
      endTime: dayjs().toISOString(),
    }),
  },
  {
    label: "Tháng hiện tại",
    value: "currentMonth",
    getRange: () => ({
      startTime: dayjs().startOf("month").toISOString(),
      endTime: dayjs().endOf("month").toISOString(),
    }),
  },
  {
    label: "3 tháng gần nhất",
    value: "last3Months",
    getRange: () => ({
      startTime: dayjs().subtract(2, "month").startOf("month").toISOString(),
      endTime: dayjs().endOf("month").toISOString(),
    }),
  },
  ...Array.from({ length: 6 }).map((_, i) => {
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

const NewCustomers = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    average: 0,
    peak: 0,
    peakDate: null,
  });

  const fetchNewCustomersData = async (range) => {
    setLoading(true);
    try {
      const { startTime, endTime } = range;
      const response = await getNewCustomers({
        startDate: dayjs(startTime).format("YYYY-MM-DD"),
        endDate: dayjs(endTime).format("YYYY-MM-DD"),
      });
      const formattedData = generateData(response, startTime, endTime);
      setChartData(formattedData);
      calculateSummary(formattedData);
    } catch (error) {
      console.error("Error fetching new customers:", error);
      setChartData([]);
      setSummary({ total: 0, average: 0, peak: 0, peakDate: null });
    } finally {
      setLoading(false);
    }
  };

  const generateData = (response, startTime, endTime) => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const data = [];

    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      const isWeekend = current.day() === 0 || current.day() === 6;
      const customerCount =
        response.find((item) => item.date === current.format("YYYY-MM-DD"))
          ?.customerCount || 0;

      data.push({
        date: current.format("YYYY-MM-DD"),
        dateDisplay: current.format("DD/MM"),
        customerCount,
        dayOfWeek: current.format("dddd"),
        isWeekend,
      });

      current = current.add(1, "day");
    }

    return data;
  };

  const calculateSummary = (data) => {
    if (data.length === 0) {
      setSummary({ total: 0, average: 0, peak: 0, peakDate: null });
      return;
    }

    const total = data.reduce((sum, item) => sum + item.customerCount, 0);
    const average = Math.round((total / data.length) * 10) / 10;
    const peakItem = data.reduce((max, item) =>
      item.customerCount > max.customerCount ? item : max,
    );

    setSummary({
      total,
      average,
      peak: peakItem.customerCount,
      peakDate: peakItem.dateDisplay,
    });
  };

  const config = {
    data: chartData,
    xField: "dateDisplay",
    yField: "customerCount",
    smooth: true,
    color: "#1890ff",
    point: {
      size: 4,
      color: "#1890ff",
    },
    line: {
      size: 3,
    },
    area: {
      color: "#1890ff",
      opacity: 0.1,
    },

    tooltip: {
      title: "dateDisplay",
      items: [
        {
          name: "👤 Số khách hàng mới",
          field: "customerCount",
        },
      ],
    },
    yAxis: {
      label: {
        formatter: (value) => `${value} KH`,
      },
      grid: {
        line: {
          style: {
            stroke: "#f0f0f0",
          },
        },
      },
    },
    xAxis: {
      label: {
        rotate: chartData.length > 15 ? Math.PI / 4 : 0,
      },
    },
  };

  useEffect(() => {
    const option = TIME_OPTIONS.find((opt) => opt.value === timeRange);
    if (option) {
      fetchNewCustomersData(option.getRange());
    }
  }, [timeRange]);

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3">
          <div className="flex items-center gap-2">
            <UserAddOutlined style={{ color: "#52c41a" }} />
            <span style={{ fontWeight: 600 }}>Khách hàng mới theo ngày</span>
          </div>

          <Select
            value={timeRange}
            onChange={setTimeRange}
            style={{ minWidth: 180 }}
            options={TIME_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
          />
        </div>
      }
      className="shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ borderRadius: 8 }}
    >
      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Statistic
            title="Tổng khách hàng mới"
            value={summary.total}
            prefix={<UsergroupAddOutlined style={{ color: "#1890ff" }} />}
            valueStyle={{ color: "#1890ff", fontSize: 18 }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Trung bình/ngày"
            value={summary.average}
            precision={1}
            prefix={<CalendarOutlined style={{ color: "#52c41a" }} />}
            valueStyle={{ color: "#52c41a", fontSize: 18 }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Ngày cao nhất"
            value={summary.peak}
            suffix={`(${summary.peakDate})`}
            prefix={<TrophyOutlined style={{ color: "#fa8c16" }} />}
            valueStyle={{ color: "#fa8c16", fontSize: 18 }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Chú thích</div>
            <Space size={4} wrap>
              <span className="text-xs">📊 Ngày thường</span>
              <span className="text-xs text-orange-500">📈 Cuối tuần</span>
            </Space>
          </div>
        </Col>
      </Row>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <Spin size="large" />
        </div>
      ) : chartData.length > 0 ? (
        <div className="h-80">
          <Line {...config} />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-80 text-gray-400">
          <UserAddOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <Text type="secondary">Không có dữ liệu khách hàng mới</Text>
        </div>
      )}
    </Card>
  );
};

export default NewCustomers;
