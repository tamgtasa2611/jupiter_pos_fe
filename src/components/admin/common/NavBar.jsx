"use client";
import React, { useState, useEffect } from "react";
import NotificationList from "../thong-bao/NotificationList";

import {
  Menu,
  Button,
  Space,
  Typography,
  Avatar,
  Dropdown,
  Badge,
  Tooltip,
  Flex,
} from "antd";
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
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserFromToken } from "@/utils/utils";
import UserProfile from "./UserProfile";
import useStockNotification from "@/utils/useStockNotification";
import { EMPLOYEE, ADMIN } from "@/constants/user";

const { Title } = Typography;

export default function NavBar({ onLogout }) {
  const user = getUserFromToken();
  const role = user?.role || EMPLOYEE;

  const [scrolled, setScrolled] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rawMenuItems = [
    {
      key: "/admin/ban-hang",
      icon: <ShoppingCartOutlined className="text-lg" />,
      label: (
        <Link href="/admin/ban-hang" className="gap-1.5 py-1">
          Bán hàng
        </Link>
      ),
    },
    {
      key: "/admin/hang-hoa",
      icon: <ShoppingOutlined className="text-lg" />,
      label: (
        <Link href="/admin/hang-hoa" className="gap-1.5 py-1">
          Hàng hóa
        </Link>
      ),
    },
    {
      key: "/admin/don-hang",
      icon: <OrderedListOutlined className="text-lg" />,
      label: (
        <Link href="/admin/don-hang" className="gap-1.5 py-1">
          Đơn hàng
        </Link>
      ),
    },
    {
      key: "/admin/khach-hang",
      icon: <TeamOutlined className="text-lg" />,
      label: (
        <Link href="/admin/khach-hang" className="gap-1.5 py-1">
          Khách hàng
        </Link>
      ),
    },
    {
      key: "/admin/nhan-vien",
      icon: <UserSwitchOutlined className="text-lg" />,
      label: (
        <Link href="/admin/nhan-vien" className="gap-1.5 py-1">
          Nhân viên
        </Link>
      ),
      adminOnly: true,
    },
    {
      key: "/admin/thong-ke",
      icon: <BarChartOutlined className="text-lg" />,
      label: (
        <Link href="/admin/thong-ke" className="gap-1.5 py-1">
          Thống kê
        </Link>
      ),
      adminOnly: true,
    },
  ];

  const menuItems = rawMenuItems
    .filter((item) => !item.adminOnly || role === ADMIN)
    .map(({ adminOnly, ...rest }) => rest);

  useStockNotification();

  return (
    <div
      className={`flex items-center justify-between px-6 sticky top-0 z-10 w-full h-16 transition-all duration-500 bg-white border-b border-slate-200`}
      style={{
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Left side - Logo */}
      <Link href="/admin/ban-hang" className="flex items-center group">
        <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white p-2 rounded-xl mr-3 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
          <div className="text-lg font-bold">POS</div>
        </div>
        <div className="relative overflow-hidden">
          <Title
            level={4}
            className="m-0 text-lg font-extrabold"
            style={{
              marginBottom: 0,
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            STORE
          </Title>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
        </div>
      </Link>

      {/* Middle - Main Navigation */}
      <div className="flex-1 mx-10">
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          className="border-0 w-full bg-transparent"
          style={{
            backgroundColor: "transparent",
            border: "0",
          }}
          theme="light"
        />
      </div>

      {/* Right side - Actions */}
      <Flex gap={8} justify="end" align="center">
        {/* Notifications */}
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <div className="flex flex-col">
                    <span className="font-semibold">Đơn hàng mới</span>
                    <span className="text-xs text-gray-500">5 phút trước</span>
                  </div>
                ),
                icon: <ShoppingCartOutlined className="text-blue-500" />,
              },
              {
                key: "2",
                label: (
                  <div className="flex flex-col">
                    <span className="font-semibold">Cảnh báo tồn kho thấp</span>
                    <span className="text-xs text-gray-500">20 phút trước</span>
                  </div>
                ),
                icon: <ShoppingOutlined className="text-orange-500" />,
              },
              { type: "divider" },

              {
                key: "3",
                label: (
                  <div onClick={() => setShowAllNotifications(true)}>
                    Xem tất cả thông báo
                  </div>
                ),
                icon: <BellOutlined />,
              },
            ],
          }}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="w-80"
          popupRender={(menu) => (
            <div className="bg-white rounded-xl drop-shadow-md border border-gray-100 overflow-hidden animate-fadeIn">
              <div className="px-4 py-3 bg-gray-50 border-gray-100 border-b">
                <span className="font-bold">Thông báo</span>
              </div>
              {menu}
            </div>
          )}
        >
          <div className="relative">
            <Tooltip title="Thông báo">
              <Badge
                count={5}
                size="small"
                offset={[-5, 5]}
                className="cursor-pointer"
                style={{ backgroundColor: "#8b5cf6" }}
              >
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  shape="circle"
                  className="flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
                />
              </Badge>
            </Tooltip>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          </div>
        </Dropdown>

        {/* User Profile */}
        <UserProfile scrolled={scrolled} onLogout={onLogout} />
      </Flex>

      {showAllNotifications && (
        <NotificationList onClose={() => setShowAllNotifications(false)} />
      )}
    </div>
  );
}
