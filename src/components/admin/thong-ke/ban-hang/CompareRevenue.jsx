"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Typography,
  Space,
  Spin,
  Statistic,
  Row,
  Col,
  DatePicker,
  Button,
  Alert,
  Progress,
  Tag,
} from "antd";
import {
  BarChartOutlined,
  CalendarOutlined,
  SwapOutlined,
  UpOutlined,
  DownOutlined,
  MinusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getRevenueByDates } from "@/requests/statistic";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Các kiểu so sánh
const COMPARE_TYPES = [
  {
    label: "So sánh theo ngày",
    value: "day",
    options: [
      {
        label: "Hôm nay và Hôm qua",
        value: "today_vs_yesterday",
        getPeriods: () => ({
          current: {
            start: dayjs().startOf("day"),
            end: dayjs().endOf("day"),
            label: "Hôm nay",
          },
          previous: {
            start: dayjs().subtract(1, "day").startOf("day"),
            end: dayjs().subtract(1, "day").endOf("day"),
            label: "Hôm qua",
          },
        }),
      },
      {
        label: "Ngày tự chọn",
        value: "custom_day",
        isCustom: true,
      },
    ],
  },
  {
    label: "So sánh theo tuần",
    value: "week",
    options: [
      {
        label: "Tuần này và Tuần trước",
        value: "this_week_vs_last_week",
        getPeriods: () => ({
          current: {
            start: dayjs().startOf("week"),
            end: dayjs().endOf("week"),
            label: "Tuần này",
          },
          previous: {
            start: dayjs().subtract(1, "week").startOf("week"),
            end: dayjs().subtract(1, "week").endOf("week"),
            label: "Tuần trước",
          },
        }),
      },
      {
        label: "7 ngày qua và 7 ngày trước đó",
        value: "last_7days_vs_previous_7days",
        getPeriods: () => ({
          current: {
            start: dayjs().subtract(6, "day").startOf("day"),
            end: dayjs().endOf("day"),
            label: "7 ngày qua",
          },
          previous: {
            start: dayjs().subtract(13, "day").startOf("day"),
            end: dayjs().subtract(7, "day").endOf("day"),
            label: "7 ngày trước đó",
          },
        }),
      },
      {
        label: "Tuần tự chọn",
        value: "custom_week",
        isCustom: true,
      },
    ],
  },
  {
    label: "So sánh theo tháng",
    value: "month",
    options: [
      {
        label: "Tháng này và Tháng trước",
        value: "this_month_vs_last_month",
        getPeriods: () => ({
          current: {
            start: dayjs().startOf("month"),
            end: dayjs().endOf("month"),
            label: "Tháng này",
          },
          previous: {
            start: dayjs().subtract(1, "month").startOf("month"),
            end: dayjs().subtract(1, "month").endOf("month"),
            label: "Tháng trước",
          },
        }),
      },
      {
        label: "30 ngày qua và 30 ngày trước đó",
        value: "last_30days_vs_previous_30days",
        getPeriods: () => ({
          current: {
            start: dayjs().subtract(29, "day").startOf("day"),
            end: dayjs().endOf("day"),
            label: "30 ngày qua",
          },
          previous: {
            start: dayjs().subtract(59, "day").startOf("day"),
            end: dayjs().subtract(30, "day").endOf("day"),
            label: "30 ngày trước đó",
          },
        }),
      },
      {
        label: "Tháng tự chọn",
        value: "custom_month",
        isCustom: true,
      },
    ],
  },
  {
    label: "So sánh theo năm",
    value: "year",
    options: [
      {
        label: "Năm nay và Năm trước",
        value: "this_year_vs_last_year",
        getPeriods: () => ({
          current: {
            start: dayjs().startOf("year"),
            end: dayjs().endOf("year"),
            label: "Năm nay",
          },
          previous: {
            start: dayjs().subtract(1, "year").startOf("year"),
            end: dayjs().subtract(1, "year").endOf("year"),
            label: "Năm trước",
          },
        }),
      },
      {
        label: "12 tháng qua và 12 tháng trước đó",
        value: "last_12months_vs_previous_12months",
        getPeriods: () => ({
          current: {
            start: dayjs().subtract(11, "month").startOf("month"),
            end: dayjs().endOf("month"),
            label: "12 tháng qua",
          },
          previous: {
            start: dayjs().subtract(23, "month").startOf("month"),
            end: dayjs().subtract(12, "month").endOf("month"),
            label: "12 tháng trước đó",
          },
        }),
      },
      {
        label: "Năm tự chọn",
        value: "custom_year",
        isCustom: true,
      },
    ],
  },
];

const CompareRevenue = () => {
  const [compareType, setCompareType] = useState("day");
  const [compareOption, setCompareOption] = useState("today_vs_yesterday");
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [previousPeriod, setPreviousPeriod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState({
    current: { revenue: 0, orders: 0, avgOrderValue: 0 },
    previous: { revenue: 0, orders: 0, avgOrderValue: 0 },
    difference: { revenue: 0, orders: 0, avgOrderValue: 0, percentage: 0 },
  });

  // Get current compare type options
  const currentTypeOptions =
    COMPARE_TYPES.find((type) => type.value === compareType)?.options || [];
  const selectedOption = currentTypeOptions.find(
    (opt) => opt.value === compareOption,
  );
  const isCustomMode = selectedOption?.isCustom;

  // Fake API call
  const fetchRevenueData = async (startDate, endDate) => {
    try {
      const res = await getRevenueByDates({
        startDate: dayjs(startDate).format("YYYY-MM-DD"),
        endDate: dayjs(endDate).format("YYYY-MM-DD"),
      });
      console.log(res);

      const totalRevenue = res?.totalRevenue || 0;
      const totalOrders = res?.totalOrders || 0;
      return {
        totalRevenue: Math.floor(totalRevenue),
        totalOrders: Math.floor(totalOrders),
        avgOrderValue:
          totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0,
      };
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
      };
    }
  };

  const fetchCompareData = async () => {
    setLoading(true);
    try {
      let periods;

      if (isCustomMode && currentPeriod && previousPeriod) {
        periods = {
          current: {
            start: currentPeriod[0],
            end: currentPeriod[1],
            label: `${currentPeriod[0].format("DD/MM/YYYY")} - ${currentPeriod[1].format("DD/MM/YYYY")}`,
          },
          previous: {
            start: previousPeriod[0],
            end: previousPeriod[1],
            label: `${previousPeriod[0].format("DD/MM/YYYY")} - ${previousPeriod[1].format("DD/MM/YYYY")}`,
          },
        };
      } else if (selectedOption?.getPeriods) {
        periods = selectedOption.getPeriods();
      } else {
        return;
      }

      const [currentData, previousData] = await Promise.all([
        fetchRevenueData(periods.current.start, periods.current.end),
        fetchRevenueData(periods.previous.start, periods.previous.end),
      ]);

      const revenueDiff = currentData.totalRevenue - previousData.totalRevenue;
      const ordersDiff = currentData.totalOrders - previousData.totalOrders;
      const avgOrderValueDiff =
        currentData.avgOrderValue - previousData.avgOrderValue;
      const revenuePercentage =
        previousData.totalRevenue > 0
          ? (revenueDiff / previousData.totalRevenue) * 100
          : 0;

      setCompareData({
        current: {
          revenue: currentData.totalRevenue,
          orders: currentData.totalOrders,
          avgOrderValue: currentData.avgOrderValue,
          label: periods.current.label,
        },
        previous: {
          revenue: previousData.totalRevenue,
          orders: previousData.totalOrders,
          avgOrderValue: previousData.avgOrderValue,
          label: periods.previous.label,
        },
        difference: {
          revenue: revenueDiff,
          orders: ordersDiff,
          avgOrderValue: avgOrderValueDiff,
          percentage: revenuePercentage,
        },
      });
    } catch (error) {
      console.error("Error fetching compare data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (value) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + " T";
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + " Tr";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "k";
    }
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <UpOutlined style={{ color: "#52c41a" }} />;
    if (value < 0) return <DownOutlined style={{ color: "#ff4d4f" }} />;
    return <MinusOutlined style={{ color: "#d9d9d9" }} />;
  };

  const getTrendColor = (value) => {
    if (value > 0) return "#52c41a";
    if (value < 0) return "#ff4d4f";
    return "#d9d9d9";
  };

  // Handle compare type change
  const handleCompareTypeChange = (newType) => {
    setCompareType(newType);
    const newTypeOptions =
      COMPARE_TYPES.find((type) => type.value === newType)?.options || [];
    const firstOption = newTypeOptions[0];
    setCompareOption(firstOption?.value || "");
    setCurrentPeriod(null);
    setPreviousPeriod(null);
  };

  // Handle compare option change
  const handleCompareOptionChange = (newOption) => {
    setCompareOption(newOption);
    setCurrentPeriod(null);
    setPreviousPeriod(null);
  };

  const handleCustomCompare = () => {
    if (currentPeriod && previousPeriod) {
      fetchCompareData();
    }
  };

  const handleReset = () => {
    setCompareType("day");
    setCompareOption("today_vs_yesterday");
    setCurrentPeriod(null);
    setPreviousPeriod(null);
  };

  useEffect(() => {
    if (!isCustomMode) {
      fetchCompareData();
    }
  }, [compareType, compareOption]);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <BarChartOutlined style={{ color: "#1890ff" }} />
          <span style={{ fontWeight: 600 }}>So sánh doanh thu</span>
        </div>
      }
      className="shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ borderRadius: 8 }}
    >
      {/* Controls */}
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle">
          {/* Step 1: Choose compare type */}
          <Col xs={24} sm={8}>
            <Text strong>Chọn kiểu so sánh</Text>
            <br />
            <Select
              value={compareType}
              onChange={handleCompareTypeChange}
              style={{ width: "100%", marginTop: 4 }}
              options={COMPARE_TYPES.map((type) => ({
                value: type.value,
                label: type.label,
              }))}
            />
          </Col>

          {/* Step 2: Choose time range option */}
          <Col xs={24} sm={8}>
            <Text strong>Chọn khoảng thời gian</Text>
            <br />
            <Select
              value={compareOption}
              onChange={handleCompareOptionChange}
              style={{ width: "100%", marginTop: 4 }}
              options={currentTypeOptions.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
            />
          </Col>

          {/* Custom date pickers if needed */}
          {isCustomMode && (
            <>
              <Col xs={24} sm={6}>
                <Text strong>Khoảng thời gian hiện tại:</Text>
                <br />
                <RangePicker
                  value={currentPeriod}
                  onChange={setCurrentPeriod}
                  style={{ width: "100%", marginTop: 4 }}
                  format="DD/MM/YYYY"
                  picker={
                    compareType === "month"
                      ? "month"
                      : compareType === "year"
                        ? "year"
                        : "date"
                  }
                />
              </Col>
              <Col xs={24} sm={6}>
                <Text strong>Khoảng thời gian so sánh:</Text>
                <br />
                <RangePicker
                  value={previousPeriod}
                  onChange={setPreviousPeriod}
                  style={{ width: "100%", marginTop: 4 }}
                  format="DD/MM/YYYY"
                  picker={
                    compareType === "month"
                      ? "month"
                      : compareType === "year"
                        ? "year"
                        : "date"
                  }
                />
              </Col>
              <Col xs={24} sm={4}>
                <div style={{ marginTop: 24 }}>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SwapOutlined />}
                      onClick={handleCustomCompare}
                      disabled={!currentPeriod || !previousPeriod}
                      size="small"
                    >
                      So sánh
                    </Button>
                  </Space>
                </div>
              </Col>
            </>
          )}

          {/* Reset button */}
          <Col xs={24} sm={isCustomMode ? 24 : 8}>
            <div style={{ marginTop: isCustomMode ? 0 : 24 }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                size="small"
              >
                Đặt lại
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Doanh thu"
                  value={compareData.current.revenue}
                  formatter={(value) =>
                    Intl.NumberFormat("vi-VN").format(value) + "đ"
                  }
                  valueStyle={{ color: "#1890ff", fontSize: 18 }}
                />
                <div className="mt-2">
                  <Space>
                    {getTrendIcon(compareData.difference.revenue)}
                    <Text
                      style={{
                        color: getTrendColor(compareData.difference.revenue),
                        fontWeight: 500,
                      }}
                    >
                      {Math.abs(compareData.difference.percentage).toFixed(1)}%
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({compareData.difference.revenue >= 0 ? "+" : ""}
                      {new Intl.NumberFormat("vi-VN").format(
                        compareData.difference.revenue,
                      )}
                      )
                    </Text>
                  </Space>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Số đơn hàng"
                  value={compareData.current.orders}
                  valueStyle={{ color: "#52c41a", fontSize: 18 }}
                />
                <div className="mt-2">
                  <Space>
                    {getTrendIcon(compareData.difference.orders)}
                    <Text
                      style={{
                        color: getTrendColor(compareData.difference.orders),
                        fontWeight: 500,
                      }}
                    >
                      {compareData.difference.orders >= 0 ? "+" : ""}
                      {compareData.difference.orders}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      đơn
                    </Text>
                  </Space>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Giá trị đơn hàng TB"
                  value={compareData.current.avgOrderValue}
                  formatter={(value) =>
                    Intl.NumberFormat("vi-VN").format(value) + "đ"
                  }
                  valueStyle={{ color: "#fa8c16", fontSize: 18 }}
                />
                <div className="mt-2">
                  <Space>
                    {getTrendIcon(compareData.difference.avgOrderValue)}
                    <Text
                      style={{
                        color: getTrendColor(
                          compareData.difference.avgOrderValue,
                        ),
                        fontWeight: 500,
                      }}
                    >
                      {compareData.difference.avgOrderValue >= 0 ? "+" : ""}
                      {formatVND(
                        Math.abs(compareData.difference.avgOrderValue),
                      )}
                    </Text>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Period Labels */}
          <div className="mb-4">
            <Row gutter={16}>
              <Col span={12}>
                <Alert
                  message={
                    <div className="text-center">
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      <Text strong>{compareData.current.label}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Intl.NumberFormat("vi-VN").format(
                          compareData.current.revenue,
                        )}
                        đ
                      </Text>
                    </div>
                  }
                  type="info"
                  showIcon={false}
                />
              </Col>
              <Col span={12}>
                <Alert
                  message={
                    <div className="text-center">
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      <Text strong>{compareData.previous.label}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Intl.NumberFormat("vi-VN").format(
                          compareData.previous.revenue,
                        )}
                        đ
                      </Text>
                    </div>
                  }
                  type="warning"
                  showIcon={false}
                />
              </Col>
            </Row>
          </div>

          {/* Performance Analysis */}
          <Card size="small" style={{ backgroundColor: "#fafafa" }}>
            <Title level={5}>📊 Phân tích hiệu suất</Title>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <div className="text-center p-3">
                  <Text strong>Mức độ tăng trưởng</Text>
                  <br />
                  <Progress
                    type="circle"
                    percent={Math.min(
                      Math.abs(compareData.difference.percentage),
                      100,
                    )}
                    strokeColor={
                      compareData.difference.percentage >= 0
                        ? "#52c41a"
                        : "#ff4d4f"
                    }
                    format={() =>
                      `${compareData.difference.percentage >= 0 ? "+" : ""}${compareData.difference.percentage.toFixed(1)}%`
                    }
                    size={80}
                  />
                </div>
              </Col>
              <Col xs={24} sm={16}>
                <div className="p-3">
                  <Space direction="vertical">
                    <div>
                      <Tag
                        color={
                          compareData.difference.revenue >= 0 ? "green" : "red"
                        }
                      >
                        Doanh thu{" "}
                        {compareData.difference.revenue >= 0 ? "tăng" : "giảm"}
                      </Tag>
                      <Text>
                        {new Intl.NumberFormat("vi-VN").format(
                          Math.abs(compareData.difference.revenue),
                        ) + "đ "}
                        so với kỳ trước
                      </Text>
                    </div>
                    <div>
                      <Tag
                        color={
                          compareData.difference.orders >= 0 ? "green" : "red"
                        }
                      >
                        Đơn hàng{" "}
                        {compareData.difference.orders >= 0 ? "tăng" : "giảm"}
                      </Tag>
                      <Text>
                        {Math.abs(compareData.difference.orders)} đơn so với kỳ
                        trước
                      </Text>
                    </div>
                    <div>
                      <Tag
                        color={
                          compareData.difference.avgOrderValue >= 0
                            ? "green"
                            : "red"
                        }
                      >
                        AOV{" "}
                        {compareData.difference.avgOrderValue >= 0
                          ? "tăng"
                          : "giảm"}
                      </Tag>
                      <Text>
                        {formatVND(
                          Math.abs(compareData.difference.avgOrderValue),
                        ) + " "}
                        so với kỳ trước
                      </Text>
                    </div>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </Card>
  );
};

export default CompareRevenue;
