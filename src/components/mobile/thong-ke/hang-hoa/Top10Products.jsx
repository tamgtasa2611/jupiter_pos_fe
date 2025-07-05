import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Select } from "antd";
import {
  ShoppingOutlined,
  DollarOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Bar } from "@ant-design/plots";
import { getProductData } from "@requests/statistic";
import dayjs from "dayjs";

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

const Top10Products = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [sortBy, setSortBy] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);

  const formatVND = (value) => {
    return (value / 1000000).toFixed(2) + " tr";
  };
  const fetchProductData = async (range) => {
    setLoading(true);
    try {
      const { startTime, endTime } = range;
      const product = await getProductData({ startTime, endTime });
      const sortField = sortBy === "revenue" ? "revenue" : "totalQuantity";
      const top10 = (product || [])
        .sort((a, b) => (b[sortField] || 0) - (a[sortField] || 0))
        .slice(0, 10)
        .map((product, index) => ({
          ...product,
          revenueFormatted: formatVND(product.revenue),
          index: index + 1,
        }));
      setProductData(top10);
    } catch (error) {
      setProductData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const option = TIME_OPTIONS.find((opt) => opt.value === timeRange);
    if (option) {
      fetchProductData(option.getRange());
    }
  }, [timeRange, sortBy]);

  const config = {
    data: productData,
    yField: sortBy === "revenue" ? "revenue" : "totalQuantity",
    xField: "index",
    isStack: false,
    isGroup: false,
    legend: { position: "left" },
    barStyle: {
      radius: [0, 4, 4, 0],
    },
    label: {
      text: "productName",
      position: "left",
      textAlign: "left",
      dx: 5,
    },
    tooltip: {
      title: (data) => `🏆 Top ${data.index}: ${data.productName}`,
      items: [
        {
          name: "💰 Tổng doanh số",
          field: "revenue",
          formatter: (value) => formatVND(value),
        },
        {
          name: "📦 Sản lượng bán ra ",
          field: "totalQuantity",
          formatter: (value) => value + " sản phẩm",
        },
      ],
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
          <Space>
            <ShoppingOutlined />
            <span>Top 10 sản phẩm bán chạy</span>
          </Space>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center w-full gap-2">
            <Select
              value={sortBy}
              onChange={setSortBy}
              className="w-55"
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
                      <FileDoneOutlined />
                      <span>Theo số lượng</span>
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
    >
      <div className="h-96">
        <Bar {...config} />
      </div>
    </Card>
  );
};

export default Top10Products;
