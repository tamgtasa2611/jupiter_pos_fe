"use client";

import { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { login } from "@/requests/auth";
import { setTokenWithExpiry, getToken } from "@/utils/utils";

import { useCurrentUser } from "@/contexts/CurrentUserContext";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useCurrentUser();

  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log("Token found, redirecting to dashboard");
      router.push("/admin/ban-hang");
    }
  }, [router]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await login({
        account: values.account,
        password: values.password,
      });
      if (res.token) {
        let user = res.user || null;

        setTokenWithExpiry(res.token, user);
        message.success(res.message || "Đăng nhập thành công!");
        router.push("/admin/ban-hang");
      } else {
        message.error(
          res.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!",
        );
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Đăng nhập thất bại. Vui lòng thử lại!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-row bg-white overflow-hidden">
      <div className="flex w-3/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Modern POS system with touchscreen and payment terminal in a stylish retail store"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/60 mix-blend-multiply"></div>
        </div>

        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-2xl font-bold">Jupiter Store POS</h2>
          <p className="text-white/80">Quản lý bán hàng thông minh</p>
        </div>
      </div>

      {/* Right section - login form */}
      <div className="w-2/5 flex items-center justify-center p-8 bg-gray-50/50">
        <Card
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "24px",
            background: "white",
            boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.07)",
          }}
          className="transition-all duration-300"
        >
          <LoginForm
            onFinish={onFinish}
            loading={loading}
            setLoading={setLoading}
          />
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
