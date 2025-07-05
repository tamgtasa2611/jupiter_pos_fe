"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Tag,
  Progress,
} from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
  MobileOutlined,
  BankOutlined,
  PayCircleOutlined,
  UpOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { Pie, Column } from "@ant-design/plots";
import { getPaymentMethodStats } from "@/requests/statistic";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const TIME_OPTIONS = [
  {
    label: "7 ngày qua",
    value: "last7Days",
    getRange: () => ({
      startTime: dayjs().subtract(6, "day").startOf("day").toISOString(),
      endTime: dayjs().endOf("day").toISOString(),
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

// Move PAYMENT_METHODS outside component and use string references for icons
const PAYMENT_METHODS = {
  BANKING: {
    name: "Chuyển khoản",
    iconType: "BankOutlined",
    color: "#1890ff",
  },
  TIEN_MAT: {
    name: "Tiền mặt",
    iconType: "DollarOutlined",
    color: "#52c41a",
  },
};

// Helper function to get icon component
const getIconComponent = (iconType) => {
  switch (iconType) {
    case "DollarOutlined":
      return DollarOutlined;
    case "BankOutlined":
      return BankOutlined;
    default:
      return PayCircleOutlined;
  }
};

const PaymentMethod = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState("pie");
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    mostUsedMethod: null,
    leastUsedMethod: null,
  });

  const fetchPaymentData = async (range) => {
    setLoading(true);
    try {
      const { startTime, endTime } = range;
      const response = await getPaymentMethodStats({
        startDate: dayjs(startTime).format("YYYY-MM-DD"),
        endDate: dayjs(endTime).format("YYYY-MM-DD"),
      });
      console.log(response);

      const data = generateData(response);
      setPaymentData(data);
      calculateSummary(data);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setPaymentData([]);
      setSummary({
        totalTransactions: 0,
        totalAmount: 0,
        mostUsedMethod: null,
        leastUsedMethod: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateData = (response) => {
    if (!response || !Array.isArray(response)) {
      return [];
    }

    return response
      .map((item) => {
        const method = item?.paymentMethod; // BANKING hoặc TIEN_MAT
        const transactionCount = item?.transactionCount || 0;
        const totalAmount = item?.totalAmount || 0;
        const averageAmount =
          transactionCount > 0 ? Math.floor(totalAmount / transactionCount) : 0;

        // Lấy thông tin method từ PAYMENT_METHODS
        const methodInfo = PAYMENT_METHODS[method] || {
          name: method,
          iconType: "PayCircleOutlined",
          color: "#d9d9d9",
        };

        return {
          method: method,
          methodName: methodInfo.name,
          transactionCount: transactionCount,
          totalAmount: totalAmount,
          formattedTotalAmount: formatVND(totalAmount),
          averageAmount: averageAmount,
          formattedAverageAmount: formatVND(averageAmount),
          iconType: methodInfo.iconType,
          color: methodInfo.color,
          percentage: 0, // Will be calculated in summary
        };
      })
      .filter((item) => item.transactionCount > 0); // Chỉ lấy những phương thức có giao dịch
  };

  const calculateSummary = (data) => {
    if (data.length === 0) {
      setSummary({
        totalTransactions: 0,
        totalAmount: 0,
        mostUsedMethod: null,
        leastUsedMethod: null,
      });
      return;
    }

    const totalTransactions = data.reduce(
      (sum, item) => sum + item.transactionCount,
      0,
    );
    const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);

    const dataWithPercentage = data.map((item) => ({
      ...item,
      percentage:
        Math.round((item.transactionCount / totalTransactions) * 100 * 10) / 10,
      amountPercentage:
        Math.round((item.totalAmount / totalAmount) * 100 * 10) / 10,
    }));

    setPaymentData(dataWithPercentage);

    const sortedByCount = [...dataWithPercentage].sort(
      (a, b) => b.transactionCount - a.transactionCount,
    );
    const mostUsedMethod = sortedByCount[0];
    const leastUsedMethod = sortedByCount[sortedByCount.length - 1];

    setSummary({
      totalTransactions,
      totalAmount,
      mostUsedMethod,
      leastUsedMethod,
    });
  };

  const formatVND = (value) => {
    if (!value || isNaN(value) || value === 0) {
      return "0";
    }

    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + "T";
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "Tr";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "K";
    }
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  // Memoize chart configs to prevent re-creation on every render
  const pieConfig = useMemo(() => {
    if (
      !paymentData ||
      !Array.isArray(paymentData) ||
      paymentData.length === 0
    ) {
      return {
        data: [],
        angleField: "transactionCount",
        colorField: "methodName",
      };
    }

    return {
      data: paymentData,
      angleField: "transactionCount",
      colorField: "methodName",
      radius: 0.8,
      innerRadius: 0.4,
      // Fixed colors cho 2 phương thức
      color: ["#1890ff", "#52c41a"], // Banking (blue), Tiền mặt (green)
      label: {
        type: "inner",
        offset: "-50%",
        content: ({ percent }) => `${(percent * 100).toFixed(1)}%`,
        style: {
          fontSize: 14,
          fontWeight: "bold",
          fill: "#fff",
          textAlign: "center",
        },
      },
      legend: {
        position: "bottom",
        itemName: {
          formatter: (text) => {
            const data = paymentData.find((d) => d.methodName === text);
            return `${text} (${data?.transactionCount || 0})`;
          },
        },
      },
      tooltip: {
        title: "methodName",
        items: [
          {
            name: "Số giao dịch",
            field: "transactionCount",
            formatter: (value) => `${value} giao dịch`,
          },
          {
            name: "Tổng tiền",
            field: "formattedTotalAmount",
          },
          {
            name: "Trung bình/giao dịch",
            field: "formattedAverageAmount",
          },
        ],
      },
      interactions: [{ type: "element-active" }],
      animation: {
        appear: {
          animation: "grow-in-x",
          duration: 1000,
        },
      },
    };
  }, [paymentData]);

  // Sửa lại columnConfig
  const columnConfig = useMemo(() => {
    if (
      !paymentData ||
      !Array.isArray(paymentData) ||
      paymentData.length === 0
    ) {
      return {
        data: [],
        xField: "methodName",
        yField: "transactionCount",
      };
    }

    return {
      data: paymentData,
      xField: "methodName",
      yField: "transactionCount",
      // Fixed colors cho 2 phương thức
      color: ["#1890ff", "#52c41a"],
      columnStyle: {
        radius: [8, 8, 0, 0],
      },
      tooltip: {
        title: "methodName",
        items: [
          {
            name: "Số giao dịch",
            field: "transactionCount",
            formatter: (value) => `${value} giao dịch`,
          },
          {
            name: "Tổng tiền",
            field: "formattedTotalAmount",
          },
        ],
      },
      yAxis: {
        label: {
          formatter: (value) => `${value}`,
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
          style: {
            fontSize: 12,
          },
        },
      },
    };
  }, [paymentData]);

  useEffect(() => {
    const option = TIME_OPTIONS.find((opt) => opt.value === timeRange);
    if (option) {
      fetchPaymentData(option.getRange());
    }
  }, [timeRange]);

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3">
          <div className="flex items-center gap-2">
            <PayCircleOutlined style={{ color: "#1890ff" }} />
            <span style={{ fontWeight: 600 }}>
              Thống kê phương thức thanh toán
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={viewType}
              onChange={setViewType}
              style={{ minWidth: 120 }}
              options={[
                { value: "pie", label: "Biểu đồ tròn" },
                { value: "column", label: "Biểu đồ cột" },
              ]}
            />
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
        </div>
      }
      className="shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ borderRadius: 8 }}
    >
      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Statistic
            title="Tổng giao dịch"
            value={summary.totalTransactions}
            prefix={<UpOutlined style={{ color: "#1890ff" }} />}
            valueStyle={{ color: "#1890ff", fontSize: 18 }}
          />
        </Col>
        <Col xs={24} sm={6}>
          <Statistic
            title="Tổng tiền"
            value={new Intl.NumberFormat("vi-VN").format(summary.totalAmount)}
            suffix="đ"
            prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
            valueStyle={{ color: "#52c41a", fontSize: 18 }}
          />
        </Col>
        <Col xs={24} sm={6}>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Phổ biến nhất</div>
            {summary.mostUsedMethod && (
              <>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span style={{ color: summary.mostUsedMethod.color }}>
                    {React.createElement(
                      getIconComponent(summary.mostUsedMethod.iconType),
                    )}
                  </span>
                  <Text strong style={{ fontSize: 14 }}>
                    {summary.mostUsedMethod.methodName}
                  </Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {summary.mostUsedMethod.percentage}% giao dịch
                </Text>
              </>
            )}
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">
              Trung bình/giao dịch
            </div>
            <Text strong style={{ fontSize: 16, color: "#fa8c16" }}>
              {summary.totalTransactions > 0
                ? new Intl.NumberFormat("vi-VN").format(
                    Math.floor(summary.totalAmount / summary.totalTransactions),
                  )
                : 0}
              đ
            </Text>
          </div>
        </Col>
      </Row>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <Spin size="large" />
        </div>
      ) : paymentData.length > 0 ? (
        <div className="h-80 mb-6">
          {viewType === "pie" ? (
            <Pie {...pieConfig} />
          ) : (
            <Column {...columnConfig} />
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-80 text-gray-400">
          <PayCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <Text type="secondary">Không có dữ liệu thanh toán</Text>
        </div>
      )}

      {/* Detailed breakdown */}
      {!loading && paymentData.length > 0 && (
        <div className="space-y-4">
          <Title level={5}>Chi tiết từng phương thức</Title>
          {paymentData.map((item) => {
            const IconComponent = getIconComponent(item.iconType);
            return (
              <div
                key={item.method}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <Row align="middle" gutter={16}>
                  <Col xs={24} sm={8}>
                    <Space>
                      <span style={{ color: item.color, fontSize: 18 }}>
                        <IconComponent />
                      </span>
                      <div>
                        <Text strong style={{ fontSize: 15 }}>
                          {item.methodName}
                        </Text>
                        <br />
                        <Tag color={item.color}>{item.percentage}%</Tag>
                      </div>
                    </Space>
                  </Col>
                  <Col xs={12} sm={5}>
                    <Statistic
                      title="Giao dịch"
                      value={item.transactionCount}
                      valueStyle={{ fontSize: 16 }}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Tổng tiền"
                      value={new Intl.NumberFormat("vi-VN").format(
                        item.totalAmount,
                      )}
                      suffix="đ"
                      valueStyle={{ fontSize: 16, color: "#52c41a" }}
                    />
                  </Col>
                  <Col xs={24} sm={5}>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Trung bình/giao dịch
                      </div>
                      <Text strong style={{ color: "#fa8c16" }}>
                        {new Intl.NumberFormat("vi-VN").format(
                          item.averageAmount,
                        )}
                        đ
                      </Text>
                    </div>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Progress
                    percent={item.percentage}
                    strokeColor={item.color}
                    showInfo={false}
                    size="small"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Insights */}
      {!loading && paymentData.length > 0 && summary.mostUsedMethod && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-center">
            <Text strong style={{ color: "#1890ff" }}>
              {summary.mostUsedMethod.methodName} là phương thức được ưa chuộng
              nhất với {summary.mostUsedMethod.percentage}% tổng số giao dịch
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Trung bình mỗi giao dịch {summary.mostUsedMethod.methodName}:{" "}
              {new Intl.NumberFormat("vi-VN").format(
                summary.mostUsedMethod.averageAmount,
              )}
              đ
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PaymentMethod;
