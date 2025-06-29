import React, { useState, useEffect } from "react";
import { Card, Space, Select } from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Bar } from "@ant-design/plots";
import { getCustomerData } from "@requests/statistic";
import dayjs from "dayjs";

const { Option } = Select;

const TIME_OPTIONS = [
  {
    label: "Hôm nay",
    value: "today",
    getRange: () => ({
      startTime: dayjs().startOf("day").toISOString(),
      endTime: dayjs().endOf("day").toISOString(),
    }),
  },
  {
    label: "7 ngày qua",
    value: "7days",
    getRange: () => ({
      startTime: dayjs().subtract(6, "day").startOf("day").toISOString(),
      endTime: dayjs().endOf("day").toISOString(),
    }),
  },
  {
    label: "1 tháng qua",
    value: "1month",
    getRange: () => ({
      startTime: dayjs()
        .subtract(1, "month")
        .add(1, "day")
        .startOf("day")
        .toISOString(),
      endTime: dayjs().endOf("day").toISOString(),
    }),
  },
  {
    label: "Năm nay",
    value: "thisYear",
    getRange: () => ({
      startTime: dayjs().startOf("year").toISOString(),
      endTime: dayjs().endOf("day").toISOString(),
    }),
  },
  {
    label: "Toàn thời gian",
    value: "allTime",
    getRange: () => ({
      startTime: "1970-01-01T00:00:00.000Z",
      endTime: dayjs().endOf("day").toISOString(),
    }),
  },
];

const TopDebtCustomer = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatVND = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "Tr";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "K";
    }
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const fetchCustomerData = async (range) => {
    setLoading(true);
    try {
      const { startTime, endTime } = range;
      const customer = await getCustomerData({ startTime, endTime });
      const top10 = (customer || [])
        .sort((a, b) => (b.totalDebt || 0) - (a.totalDebt || 0))
        .slice(0, 10)
        .map((customer, index) => ({
          ...customer,
          totalDebtFormatted: formatVND(customer.totalDebt),
          index: index + 1,
        }));
      setCustomerData(top10);
    } catch (error) {
      setCustomerData([]);
    }
    setLoading(false);
  };

  const config = {
    data: customerData,
    yField: "totalDebt",
    xField: "index",
    color: ({ index }) => {
      if (index === 1) return "#1890ff";
      if (index === 2) return "#52c41a";
      if (index === 3) return "#faad14";
      return "#d9d9d9";
    },
    barStyle: {
      radius: [0, 4, 4, 0],
    },
    label: {
      text: "customerName",
      position: "left",
      textAlign: "left",
      dx: 5,
      style: {
        fontSize: 11,
        fontWeight: (data) => (data.index <= 3 ? "bold" : "normal"),
      },
    },

    yAxis: {
      label: {
        style: { fontSize: 11, fill: "#666" },
      },
      grid: {
        line: { style: { stroke: "#f0f0f0" } },
      },
    },

    xAxis: {
      label: {
        style: { fontSize: 11, fill: "#666" },
      },
    },

    tooltip: {
      title: (data) => `${data.index}: ${data.customerName}`,
      items: [
        {
          name: "💰 Tổng nợ",
          field: "totalDebtFormatted",
        },
        {
          name: "📦 Số đơn hàng",
          field: "totalOrders",
          formatter: (value) => value + " đơn",
        },
      ],
    },
    interactions: [{ type: "element-active" }],
    animation: {
      appear: { animation: "grow-in-y", duration: 600 },
    },
    meta: {
      totalDept: {
        formatter: (value) => {
          return formatVND(value);
        },
      },
    },
    padding: [40, 20, 40, 120],
  };

  useEffect(() => {
    const option = TIME_OPTIONS.find((opt) => opt.value === timeRange);
    if (option) {
      fetchCustomerData(option.getRange());
    }
  }, [timeRange]);

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 my-4 md:my-0">
          <div className="flex items-center gap-2">
            <ShoppingOutlined />
            <span>Top 10 khách nợ nhiều nhất</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center w-full gap-2">
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
          </div>
        </div>
      }
      className="transition-shadow w-full"
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
        <Bar {...config} />
      </div>
    </Card>
  );
};

export default TopDebtCustomer;
