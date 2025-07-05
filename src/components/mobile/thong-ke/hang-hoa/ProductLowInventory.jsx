import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Select } from "antd";
import {
  ShoppingOutlined,
} from "@ant-design/icons";
import { Bar } from "@ant-design/plots";
import { getProductLowInventory } from "@/requests/statistic";
import { fill } from "lodash";

const ProductLowInventory = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);

  const formatVND = (value) => {
    return (value / 1000000).toFixed(2) + " tr";
  };
  const fetchProductData = async () => {
    setLoading(true);
    try {
      const product = await getProductLowInventory();
      const top10 = (product || [])
        .map((product, index) => ({
          ...product,
          revenueFormatted: formatVND(product.inventoryCount),
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
    yField: "inventoryCount",
    xField: "index",
    isStack: false,
    isGroup: false,
    legend: { position: "left" },
    barStyle: {
      radius: [0, 4, 4, 0],
    },
    style: {
      fill: "#e7c450",
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
          name: "📦 Số lượng sản phẩm còn lại ",
          field: "inventoryCount",
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
            <span>Top 10 mặt hàng còn tồn kho ít nhất</span>
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

export default ProductLowInventory;
