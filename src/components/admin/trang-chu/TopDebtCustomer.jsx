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

const TopDebtCustomer = () => {
  const [timeRange, setTimeRange] = useState(TIME_OPTIONS[0].value);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatVND = (value) => {
    return value / 1000000 + " tr";
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