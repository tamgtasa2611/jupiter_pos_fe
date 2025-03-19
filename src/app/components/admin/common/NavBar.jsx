"use client";
import React, { useState, useEffect } from "react";
import { Menu, Button, Space, Typography, Avatar, Dropdown, Badge, Tooltip } from "antd";
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

const { Title } = Typography;

export default function NavBar({ onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll position to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Format menu items to use with items prop
  const menuItems = [
    {
      key: "/admin/trang-chu",
      icon: <DashboardOutlined className="text-lg" />,
      label: (
        <Link href="/admin/trang-chu" className="gap-1.5 py-1">
          Trang chủ
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
    },
    {
      key: "/admin/thong-ke",
      icon: <BarChartOutlined className="text-lg" />,
      label: (
        <Link href="/admin/thong-ke" className="gap-1.5 py-1">
          Thống kê
        </Link>
      ),
    },
  ];

  return (
    <div
      className={`flex bg-white/80 backdrop-blur-xl items-center justify-between px-6 sticky top-0 z-10 w-full h-16 transition-all duration-500 ${
        scrolled ? "shadow-[0_8px_30px_rgb(0,0,0,0.08)]" : "border-b border-gray-100"
      } border-slate-200`}
      style={{
        backgroundImage:
          "radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 80%)",
      }}
    >
      {/* Left side - Logo */}
      <Link href="/admin/trang-chu" className="flex items-center group">
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
      <Space size="middle" className="flex items-center">
        {/* Search button */}
        <Tooltip title="Tìm kiếm">
          <Button
            type="text"
            icon={<SearchOutlined />}
            shape="circle"
            className="flex items-center justify-center text-lg hover:bg-gray-100 transition-colors"
          />
        </Tooltip>

        {/* Quick sale button */}
        <Link href="/admin/ban-hang">
          <Button type="primary" icon={<ShoppingCartOutlined />}>
            Bán hàng
          </Button>
        </Link>

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
                label: "Xem tất cả thông báo",
                icon: <BellOutlined />,
              },
            ],
          }}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="w-80"
          dropdownRender={(menu) => (
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
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

        {/* Settings */}
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "Cài đặt hệ thống", icon: <SettingOutlined /> },
              { key: "2", label: "Cài đặt người dùng", icon: <UserOutlined /> },
              { key: "3", label: "Cài đặt cửa hàng", icon: <BarcodeOutlined /> },
            ],
          }}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="w-56"
          dropdownRender={(menu) => (
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
              {menu}
            </div>
          )}
        >
          <Tooltip title="Cài đặt">
            <Button
              type="text"
              icon={<SettingOutlined />}
              shape="circle"
              className="flex items-center justify-center text-lg hover:bg-gray-100 transition-colors hover:rotate-45 duration-300"
            />
          </Tooltip>
        </Dropdown>

        {/* User Profile */}
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Hồ sơ cá nhân",
                onClick: () => {},
              },
              {
                key: "2",
                icon: <SettingOutlined />,
                label: "Cài đặt tài khoản",
                onClick: () => {},
              },
              { type: "divider" },
              {
                key: "3",
                icon: <LogoutOutlined />,
                label: "Đăng xuất",
                onClick: () => onLogout(),
                className: "text-red-500",
              },
            ],
          }}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="w-56"
          dropdownRender={(menu) => (
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
              <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
                <Avatar
                  size="large"
                  src="../../haohao.png"
                  className="border-2 border-blue-400"
                  style={{
                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
                  }}
                />
                <div>
                  <div className="font-semibold">Nguyen Van A</div>
                  <div className="text-xs text-gray-500">admin@example.com</div>
                </div>
              </div>
              {menu}
            </div>
          )}
        >
          <div className="cursor-pointer flex items-center ml-3 hover:bg-gray-50/30 p-0.5 rounded-full transition-all duration-300">
            <Avatar
              src="../../haohao.png"
              className="border-2 border-white shadow-sm"
              size={38}
              style={{
                boxShadow: scrolled ? "0 0 0 2px rgba(59, 130, 246, 0.3)" : "none",
                transition: "all 0.3s ease",
              }}
            />
          </div>
        </Dropdown>
      </Space>
    </div>
  );
}
