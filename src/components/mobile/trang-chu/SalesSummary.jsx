import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Select, Statistic, Segmented } from "antd";
import { Area } from "@ant-design/plots";
import dayjs from "dayjs";
import { getNetReveneues } from "@requests/statistic";

const { Title } = Typography;

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

const VIEW_OPTIONS = [
  { label: "Theo ngày", value: "day" },
  { label: "Theo giờ", value: "hour" },
  { label: "Theo thứ", value: "weekday" },
];

const SalesSummary = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [viewType, setViewType] = useState("day");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalNetRevenue, setTotalNetRevenue] = useState(0);

  const formatVND = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "Tr";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "K";
    }
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const timeOpt = TIME_OPTIONS.find((opt) => opt.value === timeRange);
        const { startTime, endTime } = timeOpt.getRange();
        const requestBody = {
          label: viewType,
          startTime,
          endTime,
        };
        const netRevenue = await getNetReveneues(requestBody);
        const top10 = (netRevenue || []).map((item, index) => ({
          ...item,
          revenueFormatted: formatVND(item.totalRevenue),
          index: index + 1,
        }));
        setChartData(top10);
        setTotalNetRevenue(
          (netRevenue || []).reduce(
            (sum, item) => sum + (item.totalRevenue || 0),
            0,
          ),
        );
      } catch (error) {
        setChartData([]);
        setTotalNetRevenue(0);
      }
      setLoading(false);
    };
    fetchData();
  }, [timeRange, viewType]);

  const config = {
    data: chartData,
    xField: "label",
    yField: "totalRevenue",
    columnWidthRatio: 0.6,
    label: {
      position: "top",
      style: {
        fill: "#000",
        fontSize: 12,
        dy: -15,
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
        formatter: (v) => formatVND(v),
      },
    },
    meta: {
      totalRevenue: {
        alias: "Doanh thu",
      },
    },
    tooltip: {
      title: null,
      items: [
        {
          name: "📅 Thời gian",
          field: "label",
        },
        {
          name: "💰 Tổng doanh thu",
          field: "revenueFormatted",
        },
      ],
    },
    animation: {
      appear: {
        duration: 1000,
        easing: "easeQuadIn",
      },
    },
    style: {
      fill: "linear-gradient(-90deg, white 0%, darkgreen 100%)",
    },
    line: {
      style: {
        stroke: "darkgreen",
        lineWidth: 2,
      },
    },
    point: {
      sizeField: 4,
      style: {
        stroke: "darkgreen",
        fill: "#fff",
      },
    },
  };

  return (
    <Card className="transition-shadow">
      <Row gutter={[16, 16]} className="w-full">
        <Col xs={24} md={12}>
          <Title level={4}>Doanh thu</Title>
          <Statistic
            value={formatVND(totalNetRevenue)}
            suffix="₫"
            valueStyle={{ color: "#3f8600", fontSize: "28px" }}
            loading={loading}
          />
        </Col>
        <Col xs={24} md={12}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-2">
            <Select
              className="w-39"
              value={timeRange}
              onChange={setTimeRange}
              popupMatchSelectWidth={false}
              options={TIME_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
            />
            <Segmented
              options={VIEW_OPTIONS}
              value={viewType}
              onChange={setViewType}
            />
          </div>
        </Col>
        <Col xs={24} className="h-80">
          {chartData.length > 0 ? (
            <Area {...config} />
          ) : (
            <div
              style={{
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default SalesSummary;
