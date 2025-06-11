"use client";

import { useEffect, useState } from "react";
import { Layout, Spin, Button } from "antd";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function CustomerLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // android Capacitor/Cordova context
    const isNative =
      typeof window !== "undefined" && (window.Capacitor || window.cordova);
    console.log("Running in native context:", isNative);

    try {
      if (typeof window === "undefined") return;
      const testKey = "test_storage_access";
      localStorage.setItem(testKey, "works");
      const result = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      console.log("LocalStorage access:", result === "works" ? "OK" : "FAILED");

      const token = localStorage.getItem("token");
      if (token) {
        console.log("Token found, redirecting to dashboard");
        router.push("/admin/ban-hang");
      } else {
        console.log("No token found, redirecting to login");
        router.replace("/dang-nhap");
      }
    } catch (e) {
      console.error("LocalStorage error:", e);
    } finally {
      setLoading(false);
      setAppReady(true);
    }
  }, [router]);

  if (loading) {
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
    <Layout
      className="landing-page App"
      style={{ minHeight: "100vh", touchAction: "manipulation" }}
    >
      <Content style={{ padding: "20px", textAlign: "center" }}></Content>
    </Layout>
  );
}
