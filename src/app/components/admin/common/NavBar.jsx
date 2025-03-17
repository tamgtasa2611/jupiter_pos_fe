"use client";
import React, { useState } from "react";
import { Menu, Button, Space, Typography, Avatar, Dropdown, Badge, Drawer } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarcodeOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Title } = Typography;

export default function NavBar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const showMobileMenu = () => {
    setMobileDrawerOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileDrawerOpen(false);
  };

  const menuItems = [
    {
      key: "/admin/trang-chu",
      icon: <DashboardOutlined />,
      label: <Link href="/admin/trang-chu">Trang chủ</Link>,
    },
    {
      key: "/admin/hang-hoa",
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/hang-hoa">Hàng hóa</Link>,
    },
    {
      key: "/admin/orders",
      icon: <OrderedListOutlined />,
      label: <Link href="/admin/orders">Đơn hàng</Link>,
    },
    {
      key: "/admin/customers",
      icon: <TeamOutlined />,
      label: <Link href="/admin/customers">Khách hàng</Link>,
    },
    {
      key: "/admin/employees",
      icon: <UserSwitchOutlined />,
      label: <Link href="/admin/employees">Nhân viên</Link>,
    },
    {
      key: "/admin/statistics",
      icon: <BarChartOutlined />,
      label: <Link href="/admin/statistics">Thống kê</Link>,
    },
  ];

  return (
    <div className="hidden md:flex bg-white items-center justify-between px-3 md:px-6 sticky top-0 z-10 border border-gray-200 drop-shadow-sm w-full h-16 ">
      {/* Left side - Logo */}
      <Link href="/admin/dashboard" className="flex items-center">
        <Title level={4} className="m-0 text-base md:text-lg" style={{ marginBottom: 0 }}>
          STORE
        </Title>
      </Link>

      {/* Middle - Main Navigation - Hide on mobile */}
      <div className="hidden md:block flex-1 mx-6">
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          className="border-0 w-full"
          style={{
            border: "0",
          }}
        />
      </div>

      {/* Right side - Actions */}
      <Space size="small" className="flex items-center">
        {/* Quick sale button - Always visible but smaller on mobile */}
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          href="/admin/ban-hang"
          className="flex items-center text-xs md:text-sm"
        >
          <span className="hidden md:inline">Bán hàng</span>
        </Button>

        {/* Notifications */}
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "New Order Notification", icon: <ShoppingCartOutlined /> },
              { key: "2", label: "Low Inventory Alert", icon: <ShoppingOutlined /> },
              { key: "3", label: "View All Notifications", icon: <BellOutlined /> },
            ],
          }}
          placement="bottomRight"
        >
          <Badge count={5} size="small">
            <Button type="text" icon={<BellOutlined />} shape="circle" />
          </Badge>
        </Dropdown>

        {/* Settings - Hide on small screens */}
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "Cài đặt hệ thống", icon: <SettingOutlined /> },
              { key: "2", label: "Cài đặt người dùng", icon: <UserOutlined /> },
              { key: "3", label: "Cài đặt cửa hàng", icon: <BarcodeOutlined /> },
            ],
          }}
          placement="bottomRight"
          className="hidden sm:block"
        >
          <Button type="text" icon={<SettingOutlined />} shape="circle" />
        </Dropdown>

        {/* User Profile */}
        <Dropdown
          menu={{
            items: [
              { key: "1", icon: <UserOutlined />, label: "Hồ sơ cá nhân" },
              { key: "2", icon: <SettingOutlined />, label: "Cài đặt tài khoản" },
              { type: "divider" },
              {
                key: "3",
                icon: <LogoutOutlined />,
                label: "Đăng xuất",
                onClick: () => onLogout(),
              },
            ],
          }}
          placement="bottomRight"
        >
          <Avatar icon={<UserOutlined />} className="cursor-pointer" />
        </Dropdown>
      </Space>
    </div>
  );
}
