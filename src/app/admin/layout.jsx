"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Layout, message } from "antd";
import NavBar from "../components/admin/common/NavBar";
import MobileNavBar from "../components/admin/common/MobileNavBar";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      router.push("/dang-nhap");
    } else {
      console.log("Token found, user is authenticated");
      setIsAuthenticated(true);
    }
  }, [router]);

  // Logout function
  const handleLogout = useCallback(() => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Show success message using App.useApp()'s message API
    message.success("Đăng xuất thành công");

    // Redirect to login page
    router.push("/dang-nhap");
  }, [router, message]);

  return (
    <Layout className="min-h-screen">
      <NavBar onLogout={handleLogout} />
      <Content className="px-0 pb-16 md:p-6 bg-gradient-to-br from-sky-100 to-white h-full">
        {children}
      </Content>
      <MobileNavBar onLogout={handleLogout} />
    </Layout>
  );
}
