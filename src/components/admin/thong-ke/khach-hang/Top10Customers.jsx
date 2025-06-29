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

const Top10Customers = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [customerData, setCustomerData] = useState([]);
  const [sortBy, setSortBy] = useState("totalSpent");
  const [loading, setLoading] = useState(true);

  const formatVND = (value) => {
    return value / 1000000 + " tr";
  };

  const fetchCustomerData = async (range) => {
    setLoading(true);
    try {
      const { startTime, endTime } = range;
      const customer = await getCustomerData({ startTime, endTime });
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
    data: customerData,
    yField: sortBy === "totalSpent" ? "totalSpent" : "totalOrders",
    xField: "index",
    isStack: false,
    isGroup: false,
    legend: { position: "left" },
    barStyle: {
      radius: [0, 4, 4, 0],
    },
    label: {
      text: "customerName",
      position: "left",
      textAlign: "left",
      dx: 5,
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

  useEffect(() => {
    const option = TIME_OPTIONS.find((opt) => opt.value === timeRange);
    if (option) {
      fetchCustomerData(option.getRange());
    }
  }, [timeRange, sortBy]);

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 my-4 md:my-0">
          <div className="flex items-center gap-2">
            <ShoppingOutlined />
            <span>Top 10 khách mua nhiều nhất</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center w-full gap-2">
            <Select
              value={sortBy}
              onChange={setSortBy}
              className="w-55"
              options={[
                {
                  value: "totalSpent",
                  label: (
                    <Space>
                      <DollarOutlined />
                      <span>Theo tổng chi</span>
                    </Space>
                  ),
                },
                {
                  value: "totalOrders",
                  label: (
                    <Space>
                      <FileDoneOutlined />
                      <span>Theo số lượng đơn hàng </span>
                    </Space>
                  ),
                },
              ]}
            />

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

export default Top10Customers;
