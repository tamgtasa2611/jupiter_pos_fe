"use client";
import "@ant-design/v5-patch-for-react-19";
import { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function CustomerLandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if running in a Capacitor/Cordova context
    const isNative = window.Capacitor || window.cordova;

    // Check if the user is logged in
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.push("/dang-nhap");
    } else {
      setLoading(false);
    }

    // Handle hardware back button for Android
    if (isNative && window.Capacitor?.Plugins?.App) {
      const { App } = window.Capacitor.Plugins;
      const handleBackButton = () => {
        // Custom back button logic
        return false; // Prevents default behavior
      };

      App.addListener("backButton", handleBackButton);
      return () => App.removeAllListeners();
    }
  }, [router]);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout
      className="landing-page App"
      style={{ minHeight: "100vh", touchAction: "manipulation" }}
    >
      <Content style={{ padding: "10px" }}>{/* Your landing page content will go here */}</Content>
    </Layout>
  );
}
