"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";
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

const LoginForm = ({ onFinish, loading, setLoading }) => {
  const [focused, setFocused] = useState("");
  const router = useRouter();

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
          name="account"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập username, email hoặc số điện thoại!",
            },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                // Kiểm tra email:
                const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
                // Kiểm tra số điện thoại VN:
                const isPhone = /^(0|\+84)\d{9,10}$/.test(value);
                // Kiểm tra username (cho phép chữ, số, dấu gạch dưới, độ dài từ 3 đến 20 ký tự)
                const isUsername = /^(?=.{3,20}$)[a-zA-Z0-9_]+$/.test(value);
                if (isEmail || isPhone || isUsername) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "Vui lòng nhập đúng username, email hoặc số điện thoại!",
                );
              },
            },
          ]}
        >
          <Input
            prefix={
              <UserOutlined
                className={`text-gray-400 transition-colors ${
                  focused === "account" ? "text-blue-500" : ""
                }`}
              />
            }
            placeholder="Email hoặc số điện thoại"
            onFocus={() => setFocused("account")}
            onBlur={() => setFocused("")}
            style={{
              borderRadius: "16px",
              height: "56px",
              padding: "8px 20px",
              fontSize: "1rem",
              boxShadow:
                focused === "account"
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
      </Form>
    </>
  );
};

export default LoginForm;
