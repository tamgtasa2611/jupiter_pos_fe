"use client";

import React from "react";
import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { BarChartOutlined, UserOutlined } from "@ant-design/icons";
import { EMPLOYEE, ADMIN } from "@/constants/user";
import { getUserFromToken } from "@/utils/utils";

const StatisticMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUserFromToken();
  const role = user?.role || EMPLOYEE;

  const tabItems = [
    {
      key: "/admin/thong-ke/ban-hang",
      label: (
        <span>
          <BarChartOutlined />
          Thống kê bán hàng
        </span>
      ),
    },
    {
      key: "/admin/thong-ke/khach-hang",
      label: (
        <span>
          <UserOutlined />
          Thống kê khách hàng
        </span>
      ),
    },
  ];

  const handleTabChange = (activeKey) => {
    router.push(activeKey);
  };

  const getActiveKey = () => {
    const currentTab = tabItems.find((item) => pathname.startsWith(item.key));
    return currentTab ? currentTab.key : tabItems[0]?.key;
  };

  return (
    <Tabs
      activeKey={getActiveKey()}
      onChange={handleTabChange}
      items={tabItems}
      size="large"
      type="card"
    />
  );
};

export default StatisticMenu;
