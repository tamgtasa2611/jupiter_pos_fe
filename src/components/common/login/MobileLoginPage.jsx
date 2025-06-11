"use client";

import { useEffect } from "react";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";

const MobileLoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token found, redirecting to dashboard");
      router.push("/admin/ban-hang");
    }
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-sky-50 to-sky-200 overflow-hidden">
      {/* Content container with mobile-first padding */}
      <div className="w-full flex flex-1 items-center justify-center px-4 py-6">
        <Card
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "24px",
            background: "white",
            boxShadow: "0 6px 24px 0 rgba(0, 0, 0, 0.08)",
          }}
          className="transition-all duration-300"
        >
          <LoginForm />
        </Card>
      </div>

      {/* Optional footer for mobile version */}
      <div className="text-center pb-4 text-gray-600 text-sm">
        <p>Jupiter Store POS © 2025</p>
        <p>Quản lý bán hàng thông minh</p>
      </div>
    </div>
  );
};

export default MobileLoginPage;
