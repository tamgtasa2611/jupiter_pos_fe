"use client";
import "@ant-design/v5-patch-for-react-19";
import { useEffect } from "react";
import { Layout } from "antd";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function CustomerLandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    // If no token is found, redirect to login page
    if (!token) {
      router.push("/dang-nhap"); // Change this path if your login route is different
    }
  }, [router]);

  return (
    <Layout className="landing-page App">
      <Content>{/* Your landing page content will go here */}</Content>
    </Layout>
  );
}
