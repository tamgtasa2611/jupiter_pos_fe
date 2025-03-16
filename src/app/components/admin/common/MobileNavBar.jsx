"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Add useRouter import
import { Popover, Button } from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  EllipsisOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined, // Add logout icon
} from "@ant-design/icons";

export default function MobileNavBar({ onLogout }) {
  const pathname = usePathname();
  const router = useRouter(); // Add router
  const [visible, setVisible] = useState(false);

  // Helper function to check if a menu item is active
  const isActive = (itemKey) => {
    // Check for exact match or if pathname starts with the key
    return pathname === itemKey || pathname.startsWith(itemKey);
  };

  // Handle logout with proper navigation
  const handleLogout = () => {
    setVisible(false); // Close the popover

    // Call the onLogout function passed from the parent
    if (onLogout) {
      onLogout();

      // As a backup, directly navigate after a short delay
      setTimeout(() => {
        console.log("Backup navigation to login page");
        window.location.href = "/dang-nhap";
      }, 300);
    } else {
      // If onLogout is not provided, navigate directly
      console.log("Direct navigation to login page");
      router.push("/dang-nhap");
    }
  };

  const moreMenuItems = [
    {
      key: "/admin/customers",
      icon: <TeamOutlined />,
      label: "Khách hàng",
      href: "/admin/customers",
    },
    {
      key: "/admin/employees",
      icon: <UserSwitchOutlined />,
      label: "Nhân viên",
      href: "/admin/employees",
    },
    {
      key: "/admin/statistics",
      icon: <BarChartOutlined />,
      label: "Thống kê",
      href: "/admin/statistics",
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      // href: "/dang-nhap",
      customBehaviour: handleLogout, // Add custom behaviour
    },
  ];

  const moreMenuContent = (
    <div className="grid grid-cols-2 gap-4 p-2 w-60">
      {moreMenuItems.map((item) => (
        <Link
          href={item.href ? item.href : "#"}
          key={item.key}
          className={`flex flex-col items-center justify-center p-2 rounded-lg`}
          style={{
            color: isActive(item.key) ? "#1890ff" : "#666",
            backgroundColor: isActive(item.key) ? "#f0f5ff" : "transparent",
            borderRadius: "8px",
            padding: "2px",
          }}
          onClick={() => {
            setVisible(false);
            if (item.customBehaviour) {
              item.customBehaviour();
            }
          }}
        >
          <div className="text-xl mb-1">{item.icon}</div>
          <div className="text-xs">{item.label}</div>
        </Link>
      ))}
    </div>
  );

  const navItems = [
    {
      key: "/admin/trang-chu",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      href: "/admin/trang-chu",
    },
    {
      key: "/admin/hang-hoa",
      icon: <ShoppingOutlined />,
      label: "Hàng hóa",
      href: "/admin/hang-hoa",
    },
    {
      key: "/admin/sale",
      icon: <ShoppingCartOutlined />,
      label: "Bán hàng",
      href: "/admin/sale",
      special: true,
    },
    {
      key: "/admin/orders",
      icon: <OrderedListOutlined />,
      label: "Đơn hàng",
      href: "/admin/orders",
    },
  ];

  // Check if any "more menu" item is active
  const isAnyMoreItemActive = moreMenuItems.some((item) => isActive(item.key));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          if (item.special) {
            return (
              <Link href={item.href} key={item.key}>
                <Button
                  type="primary"
                  shape="circle"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <ShoppingCartOutlined
                    style={{
                      fontSize: "16px",
                      color: "white",
                    }}
                  />
                </Button>
              </Link>
            );
          } else {
            return (
              <Link
                href={item.href}
                key={item.key}
                className={`flex flex-col items-center justify-center w-1/5`}
                style={{
                  color: isActive(item.key) ? "#1890ff" : "#666",
                  backgroundColor: isActive(item.key) ? "#f0f5ff" : "transparent",
                  borderRadius: "8px",
                  padding: "2px",
                }}
              >
                <div className={`text-xl`}>{item.icon}</div>
                <div className="text-xs mt-1">{item.label}</div>
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
          classNames={{ root: "mobile-nav-popover" }}
        >
          <div
            className={`flex flex-col items-center justify-center w-1/5 ${
              visible || isAnyMoreItemActive ? "text-blue-500" : "text-gray-600"
            }`}
            aria-label="More options"
          >
            <div className="text-xl">
              <EllipsisOutlined />
            </div>
            <div className="text-xs mt-1">Xem thêm</div>
          </div>
        </Popover>
      </div>
    </div>
  );
}
