"use client";

import React from "react";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EMPLOYEE, ADMIN } from "@/constants/user";
import { getUserFromToken } from "@/utils/utils";

const StatisticMenu = () => {
  const pathname = usePathname();
  const user = getUserFromToken();
  const role = user?.role || EMPLOYEE;

  const rawMenuItems = [
    {
      key: "/admin/thong-ke/ban-hang",
      label: <Link href="/admin/thong-ke/ban-hang">Bán hàng</Link>,
      adminOnly: true,
    },
    {
      key: "/admin/thong-ke/khach-hang",
      label: <Link href="/admin/thong-ke/khach-hang">Khách hàng</Link>,
      adminOnly: true,
    },
  ];

  const menuItems = rawMenuItems
    .filter((item) => !item.adminOnly || role === ADMIN)
    .map(({ adminOnly, ...rest }) => rest);

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      style={{ height: "100%", borderRight: 0 }}
      items={menuItems}
    />
  );
};

export default StatisticMenu;