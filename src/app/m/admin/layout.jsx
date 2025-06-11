"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Layout, message } from "antd";
import NavBar from "@components/admin/common/NavBar";
import MobileNavBar from "@components/admin/common/MobileNavBar";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@atoms/common";
import { RecoilRoot } from "recoil";

const { Content } = Layout;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      router.replace("/dang-nhap");
    } else {
      console.log("Token found, user is authenticated");
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, additional setup can be done here.");
    }
  }, [isAuthenticated]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");

    message.success("Đăng xuất thành công");

    router.replace("/dang-nhap");
  }, [router, message]);

  return (
    <RecoilRoot>
      <Layout className="h-dvh">
        {!isMobile && <NavBar onLogout={handleLogout} />}
        <Content className="bg-gray-50/50 overflow-y-auto px-0 pb-16 md:p-6 h-full">
          {children}
        </Content>
        {isMobile && <MobileNavBar onLogout={handleLogout} />}
      </Layout>
    </RecoilRoot>
  );
}
