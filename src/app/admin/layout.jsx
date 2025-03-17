"use client";

import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { Layout, message } from "antd";
import NavBar from "../components/admin/common/NavBar";
import MobileNavBar from "../components/admin/common/MobileNavBar";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Check for mobile screen
  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

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

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, additional setup can be done here.");
    }
  }, [isAuthenticated]);

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
    <Layout className="h-dvh">
      <NavBar onLogout={handleLogout} />
      <Content className=" bg-gradient-to-br from-sky-100 to-white  overflow-y-auto px-0 pb-16 md:p-6 h-full">
        {children}
      </Content>
      {isMobile && <MobileNavBar onLogout={handleLogout} />}
    </Layout>
  );
}
