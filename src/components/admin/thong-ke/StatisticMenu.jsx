"use client";

import React from "react";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const StatisticMenu = () => {
  const pathname = usePathname();
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["1"]}
      selectedKeys={[pathname]}
      defaultOpenKeys={["sub1"]}
      style={{ height: "100%", borderRight: 0 }}
    >
      <Menu.Item key="/admin/thong-ke/nhan-vien">
        <Link href="/admin/thong-ke/nhan-vien">Bán hàng</Link>
      </Menu.Item>
      <Menu.Item key="/admin/thong-ke/hang-hoa">
        <Link href="/admin/thong-ke/hang-hoa">Hàng hóa</Link>
      </Menu.Item>
      <Menu.Item key="/admin/thong-ke/khach-hang">
        <Link href="/admin/thong-ke/khach-hang">Đơn hàng</Link>
      </Menu.Item>
      <Menu.Item key="/admin/thong-ke/don-hang">
        <Link href="/admin/thong-ke/don-hang">Khách hàng</Link>
      </Menu.Item>
      <Menu.Item key="/admin/thong-ke/ban-hang">
        <Link href="/admin/thong-ke/ban-hang">Nhân viên</Link>
      </Menu.Item>
    </Menu>
  );
};

export default StatisticMenu;
