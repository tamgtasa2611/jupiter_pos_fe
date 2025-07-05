import React, { useState, useEffect } from "react";
import { Card, Space, Select } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { getOrderStatusStatistic } from "../../../requests/statistic";
import { ORDER_STATUS_MAP } from "../../../constants/order";
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

const OrderStatusReport = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderStatusData = async (range) => {
    setLoading(true);
    try {
      const { startTime, endTime } = range;
      const data = await getOrderStatusStatistic({ startTime, endTime });
      setOrderStatusData(data);
    } catch (error) {
      setOrderStatusData([]);
    }
    setLoading(false);
  };

  // Map lại dữ liệu để xField là label tiếng Việt, giữ mã code cho màu và tooltip
  const mappedData = orderStatusData.map((item) => ({
    ...item,
    orderStatusLabel: ORDER_STATUS_MAP[item.orderStatus]?.label || item.orderStatus,
    orderStatusCode: item.orderStatus,
    orderStatus: ORDER_STATUS_MAP[item.orderStatus]?.label || item.orderStatus,
  }));

  const config = {
    data: mappedData,
    yField: "totalOrders",
    xField: "orderStatus",
    barStyle: {
      radius: [0, 4, 4, 0],
    },
    style: {
      fill: ({ orderStatusCode }) => {
        return ORDER_STATUS_MAP[orderStatusCode]?.color || "default";
      },
    },
    xAxis: {
      label: {
        style: {
          fontSize: 9,
          maxWidth: 70,
          wordBreak: 'break-all',
        },
      },
    },
    tooltip: {
      title: null,
      items: [
        {
          name: "Trạng thái đơn hàng",
          field: "orderStatusLabel",
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
    padding: [40, 20, 40, 120],
  };

  useEffect(() => {
    const option = TIME_OPTIONS.find((opt) => opt.value === timeRange);
    if (option) {
      fetchOrderStatusData(option.getRange());
    }
  }, [timeRange]);

  return (
    <Card
      title={
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 my-4 md:my-0">
          <div className="flex items-center gap-2">
            <ShoppingOutlined />
            <span>Thống kê trình trạng đơn hàng</span>
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
        <Column {...config} />
      </div>
    </Card>
  );
};

export default OrderStatusReport;
