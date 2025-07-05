import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Select } from "antd";
import {
  ShoppingOutlined,
} from "@ant-design/icons";
import { Bar } from "@ant-design/plots";
import { getProductDeadStock  } from "@/requests/statistic";

const ProductDeadStock = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);

  const formatVND = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "Tr";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "K";
    }
    return new Intl.NumberFormat("vi-VN").format(value);
  };
  const fetchProductData = async () => {
    setLoading(true);
    try {
      const product = await getProductDeadStock();
      const top10 = (product || [])
        .sort((a, b) => (b.dayCount || 0) - (a.dayCount || 0))
        .slice(0, 10)
        .map((product, index) => ({
          ...product,
          revenueFormatted: formatVND(product.dayCount),
          index: index + 1,
        }));
      setProductData(top10);
    } catch (error) {
      setProductData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const config = {
    data: productData,
    yField: "dayCount",
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
      title: null,
      items: [
        {
          name: "Số ngày không bán được sản phẩm nào",
          field: "dayCount",
          formatter: (value) => value + " ngày",
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
            <span>Sản phẩm bán chậm – Số ngày không có giao dịch </span>
          </Space>
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

export default ProductDeadStock;