"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Layout, message, Spin } from "antd";
import NavBar from "@components/admin/common/NavBar";
import MobileNavBar from "@components/admin/common/MobileNavBar";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@atoms/common";
import { RecoilRoot } from "recoil";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import { getToken } from "@/utils/utils";

const { Content } = Layout;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isMobile = useIsMobile();
  // Lấy token ngay cách đồng bộ (localStorage là sync)
  const token = typeof window !== "undefined" ? getToken() : null;
  // Check authentication on component mount
  useEffect(() => {
    if (!token) {
      router.replace("/dang-nhap");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, additional setup can be done here.");
    }
  }, [isAuthenticated]);

  // Logout function
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    message.success("Đăng xuất thành công");
    router.replace("/dang-nhap");
  }, [router, message]);

  if (!token) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <CurrentUserProvider>
      <RecoilRoot>
        <Layout className="h-dvh">
          {!isMobile && <NavBar onLogout={handleLogout} />}
          <Content className="bg-gray-50/50 overflow-y-auto px-0 pb-16 md:p-6 h-full">
            {children}
          </Content>
          {isMobile && <MobileNavBar onLogout={handleLogout} />}
        </Layout>
      </RecoilRoot>
    </CurrentUserProvider>
  );
}
