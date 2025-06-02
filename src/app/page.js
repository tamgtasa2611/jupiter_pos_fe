"use client";
import "@ant-design/v5-patch-for-react-19";
import { useEffect, useState } from "react";
import { Layout, Spin, Button } from "antd";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function CustomerLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simple check to verify component is mounting correctly
    console.log("Landing page mounted");

    // Check if running in a Capacitor/Cordova context
    const isNative =
      typeof window !== "undefined" && (window.Capacitor || window.cordova);
    console.log("Running in native context:", isNative);

    // Log if localStorage is accessible
    try {
      const testKey = "test_storage_access";
      localStorage.setItem(testKey, "works");
      const result = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      console.log("LocalStorage access:", result === "works" ? "OK" : "FAILED");

      // Check if token exists
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Token found, redirecting to dashboard");
        router.push("/admin/trang-chu");
      } else {
        console.log("No token found, redirecting to login");
        router.replace("/dang-nhap");
      }
    } catch (e) {
      console.error("LocalStorage error:", e);
    } finally {
      // Set loading to false regardless of outcome
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
        <p style={{ marginTop: 16 }}>Vui lòng chờ ứng dụng khởi động...</p>
      </div>
    );
  }

  // This should never be reached since we're redirecting in useEffect
  return (
    <Layout
      className="landing-page App"
      style={{ minHeight: "100vh", touchAction: "manipulation" }}
    >
      <Content style={{ padding: "20px", textAlign: "center" }}></Content>
    </Layout>
  );
}
