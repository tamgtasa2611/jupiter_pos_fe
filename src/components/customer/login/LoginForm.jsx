"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const router = useRouter();

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
    <>
      <div className="text-center mb-8">
        <Title
          level={3}
          style={{ fontSize: "2rem", marginBottom: "8px", fontWeight: "700" }}
        >
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
              boxShadow:
                focused === "email"
                  ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
                  : "none",
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
              boxShadow:
                focused === "password"
                  ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
                  : "none",
              transition: "all 0.3s ease",
            }}
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-600 font-medium">
                Ghi nhớ đăng nhập
              </Checkbox>
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
    </>
  );
};

export default LoginForm;
