"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token found, redirecting to dashboard");
      router.push("/admin/trang-chu");
    }
  }, [router]);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Giả lập API call đăng nhập - thay thế bằng API thực tế sau này
      console.log("Login values:", values);

      // Simulate login success and saving token
      setTimeout(() => {
        // Store token in localStorage for authentication
        localStorage.setItem("token", "example-token-value");
        message.success("Đăng nhập thành công!");
        router.push("/admin/trang-chu"); // Chuyển về trang chủ sau khi đăng nhập
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error("Đăng nhập thất bại. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left section - logo and intro (full width on desktop) */}
      <div
        className="hidden md:flex md:w-3/5 text-white p-10 flex-col justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #0ea5e9 100%)",
        }}
      >
        {/* Background geometric elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute bottom-[15%] right-[15%] w-80 h-80 rounded-full bg-sky-200/30 blur-3xl"></div>
        </div>

        {/* Foreground content */}
        <div className="relative max-w-2xl mx-auto">
          <div className="mb-10 flex items-center">
            <div className="bg-white text-blue-600 p-3 rounded-2xl shadow-lg mr-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 8V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H9C6.17157 22 4.75736 22 3.87868 21.1213C3 20.2426 3 18.8284 3 16V8M21 8L15.5657 3.43425C14.7322 2.69168 14.3154 2.32039 13.8315 2.13146C13.3476 1.94252 12.8179 1.94839 11.7585 1.96013C10.6991 1.97187 10.1694 1.98774 9.68548 2.17871C9.20152 2.36968 8.78484 2.74397 7.95146 3.49255L3 8M21 8H3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 16C9 14.3431 10.3431 13 12 13C13.6569 13 15 14.3431 15 16C15 17.6569 13.6569 19 12 19C10.3431 19 9 17.6569 9 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Title
              level={2}
              style={{ color: "white", margin: 0, fontSize: "2rem", fontWeight: "700" }}
            >
              Jupiter Store
            </Title>
          </div>

          <Title
            level={1}
            style={{
              color: "white",
              marginBottom: "1.5rem",
              fontSize: "3.5rem",
              fontWeight: "800",
              lineHeight: "1.2",
            }}
          >
            Quản lý cửa hàng <br />
            thông minh
          </Title>

          <Paragraph
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1.25rem",
              maxWidth: "700px",
              margin: "0 auto 3rem",
              lineHeight: "1.6",
            }}
          >
            Nền tảng quản lý bán hàng hiện đại giúp doanh nghiệp của bạn phát triển nhanh chóng và
            hiệu quả.
          </Paragraph>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                className="text-sky-300 mb-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M15 8.5C14.315 7.81501 13.1087 7.33085 12 7.33085C9.42267 7.33085 7.33333 9.42019 7.33333 11.9975C7.33333 14.5748 9.42267 16.6642 12 16.6642C14.5773 16.6642 16.6667 14.5748 16.6667 11.9975C16.6667 11.8642 16.6619 11.7327 16.6527 11.6033"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M13.5 9L16 11.5L18.5 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Text
                style={{
                  color: "white",
                  fontStyle: "normal",
                  fontSize: "1.1rem",
                  display: "block",
                  marginBottom: "1rem",
                  fontWeight: "500",
                }}
              >
                "Hệ thống POS của Jupiter đã giúp doanh thu của chúng tôi tăng 30% chỉ trong 3
                tháng."
              </Text>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 mr-3 flex items-center justify-center text-white font-bold text-sm">
                  NV
                </div>
                <div>
                  <Text strong style={{ color: "white", fontSize: "1rem" }}>
                    Nguyễn Văn A
                  </Text>
                  <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>CEO, Shop ABC</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                className="text-sky-300 mb-4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 15.5L19 19M5 11C5 14.3137 7.68629 17 11 17C12.6597 17 14.1621 16.3261 15.2483 15.2483C16.3261 14.1621 17 12.6597 17 11C17 7.68629 14.3137 5 11 5C7.68629 5 5 7.68629 5 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Text
                style={{
                  color: "white",
                  fontStyle: "normal",
                  fontSize: "1.1rem",
                  display: "block",
                  marginBottom: "1rem",
                  fontWeight: "500",
                }}
              >
                "Quản lý kho hàng trở nên dễ dàng hơn bao giờ hết với Jupiter POS."
              </Text>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-3 flex items-center justify-center text-white font-bold text-sm">
                  TB
                </div>
                <div>
                  <Text strong style={{ color: "white", fontSize: "1rem" }}>
                    Trần Thị B
                  </Text>
                  <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>Quản lý, Cửa hàng XYZ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - login form (fullscreen on mobile) */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-4 md:p-8 min-h-screen md:min-h-0 bg-gray-50/50">
        <Card
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "24px",
            background: "white",
            border: "none",
          }}
          className="transition-all duration-300 shadow-drop"
        >
          <div className="text-center mb-8">
            <Title level={3} style={{ fontSize: "2rem", marginBottom: "8px", fontWeight: "700" }}>
              Xin chào!
            </Title>
            <Text type="secondary" style={{ fontSize: "1.1rem" }}>
              Vui lòng đăng nhập để tiếp tục
            </Text>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined
                    className={`text-gray-400 transition-colors ${
                      focused === "email" ? "text-blue-500" : ""
                    }`}
                  />
                }
                placeholder="Email của bạn"
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={{
                  borderRadius: "16px",
                  height: "56px",
                  padding: "8px 20px",
                  fontSize: "1rem",
                  boxShadow: focused === "email" ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
                  transition: "all 0.3s ease",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={
                  <LockOutlined
                    className={`text-gray-400 transition-colors ${
                      focused === "password" ? "text-blue-500" : ""
                    }`}
                  />
                }
                placeholder="Mật khẩu"
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                style={{
                  borderRadius: "16px",
                  height: "56px",
                  padding: "8px 20px",
                  fontSize: "1rem",
                  boxShadow: focused === "password" ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
                  transition: "all 0.3s ease",
                }}
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-600 font-medium">Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <Link
                  href="/quen-mat-khau"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
                loading={loading}
                style={{
                  height: "56px",
                  borderRadius: "16px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  boxShadow: "0 10px 20px -10px rgba(79, 70, 229, 0.5)",
                  transition: "all 0.3s ease",
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="flex items-center justify-center my-6">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">hoặc tiếp tục với</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                icon={<GoogleOutlined style={{ fontSize: "1.2rem" }} />}
                size="large"
                className="flex items-center justify-center hover:bg-gray-50 transition-all"
                style={{
                  borderRadius: "14px",
                  height: "48px",
                  borderColor: "#eaeaea",
                  color: "#555",
                }}
              />
              <Button
                icon={<FacebookOutlined style={{ fontSize: "1.2rem" }} />}
                size="large"
                className="flex items-center justify-center hover:bg-gray-50 transition-all"
                style={{
                  borderRadius: "14px",
                  height: "48px",
                  borderColor: "#eaeaea",
                  color: "#3b5998",
                }}
              />
              <Button
                icon={<AppleOutlined style={{ fontSize: "1.2rem" }} />}
                size="large"
                className="flex items-center justify-center hover:bg-gray-50 transition-all"
                style={{
                  borderRadius: "14px",
                  height: "48px",
                  borderColor: "#eaeaea",
                  color: "#000",
                }}
              />
            </div>

            <div className="text-center mt-6 text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/dang-ky"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Đăng ký ngay
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
