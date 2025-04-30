"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Popover, Badge } from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

export default function MobileNavBar({ onLogout }) {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  // Helper function to check if a menu item is active
  const isActive = (itemKey) => {
    return pathname === itemKey || pathname.startsWith(itemKey);
  };

  // Handle logout with proper navigation
  const handleLogout = () => {
    setVisible(false);
    if (onLogout) {
      onLogout();
      setTimeout(() => {
        window.location.href = "/dang-nhap";
      }, 300);
    } else {
      router.push("/dang-nhap");
    }
  };

  const moreMenuItems = [
    {
      key: "/admin/khach-hang",
      icon: <TeamOutlined style={{ fontSize: "18px" }} />,
      label: "Khách hàng",
      href: "/admin/khach-hang",
    },
    {
      key: "/admin/nhan-vien",
      icon: <UserSwitchOutlined style={{ fontSize: "18px" }} />,
      label: "Nhân viên",
      href: "/admin/nhan-vien",
    },
    {
      key: "/admin/thong-ke",
      icon: <BarChartOutlined style={{ fontSize: "18px" }} />,
      label: "Thống kê",
      href: "/admin/thong-ke",
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: "18px" }} />,
      label: "Đăng xuất",
      customBehaviour: handleLogout,
    },
  ];

  const moreMenuContent = (
    <div className="grid grid-cols-2 gap-3 p-2 w-64">
      {moreMenuItems.map((item) => (
        <Link
          href={item.href ? item.href : "#"}
          key={item.key}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
            isActive(item.key) ? "bg-blue-50" : "hover:bg-gray-50"
          }`}
          onClick={(e) => {
            if (item.customBehaviour) {
              e.preventDefault();
              item.customBehaviour();
            }
            setVisible(false);
          }}
        >
          <div
            className={`mb-1.5 p-2 rounded-full ${
              isActive(item.key)
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.icon}
          </div>
          <div
            className={`text-xs font-medium ${
              isActive(item.key) ? "text-primary" : "text-gray-600"
            }`}
          >
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  );

  const navItems = [
    {
      key: "/admin/trang-chu",
      icon: <HomeOutlined style={{ fontSize: "20px" }} />,
      label: "Trang chủ",
      href: "/admin/trang-chu",
    },
    {
      key: "/admin/hang-hoa",
      icon: <ShoppingOutlined style={{ fontSize: "20px" }} />,
      label: "Hàng hóa",
      href: "/admin/hang-hoa",
    },
    {
      key: "/admin/ban-hang",
      icon: (
        <ShoppingCartOutlined style={{ fontSize: "20px", color: "white" }} />
      ),
      label: "Bán hàng",
      href: "/admin/ban-hang",
      special: true,
    },
    {
      key: "/admin/don-hang",
      icon: <OrderedListOutlined style={{ fontSize: "20px" }} />,
      label: "Đơn hàng",
      href: "/admin/don-hang",
    },
  ];

  // Check if any "more menu" item is active
  const isAnyMoreItemActive = moreMenuItems.some((item) => isActive(item.key));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 ">
      <div className="flex items-center justify-around bg-white border-t border-gray-200">
        {navItems.map((item) => {
          if (item.special) {
            return (
              <Link
                href={item.href}
                key={item.key}
                className="flex flex-col items-center relative -top-3"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full"
                  style={{
                    background: "var(--primary-color)",
                  }}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-gray-600 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          } else {
            return (
              <Link
                href={item.href}
                key={item.key}
                className="flex flex-col items-center justify-center p-2"
              >
                <div
                  className={`relative flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                    isActive(item.key)
                      ? "bg-sky-50 text-primary"
                      : "text-gray-500"
                  }`}
                >
                  {item.icon}
                  {isActive(item.key) && (
                    <span className="absolute -bottom-1 inset-x-1 h-0.5 bg-primary rounded-full"></span>
                  )}
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive(item.key) ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }
        })}

        <Popover
          content={moreMenuContent}
          trigger="click"
          placement="topRight"
          open={visible}
          onOpenChange={(newOpen) => setVisible(newOpen)}
          overlayClassName="mobile-nav-popover"
          overlayStyle={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="flex flex-col items-center p-2"
            onClick={() => setVisible(!visible)}
          >
            <div
              className={`relative flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                visible || isAnyMoreItemActive
                  ? "bg-sky-50 text-primary"
                  : "text-gray-500"
              }`}
            >
              <EllipsisOutlined style={{ fontSize: "20px" }} />
              {(visible || isAnyMoreItemActive) && (
                <span className="absolute -bottom-1 inset-x-1 h-0.5 bg-primary rounded-full"></span>
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                visible || isAnyMoreItemActive
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              Xem thêm
            </span>
          </div>
        </Popover>
      </div>
    </div>
  );
}
