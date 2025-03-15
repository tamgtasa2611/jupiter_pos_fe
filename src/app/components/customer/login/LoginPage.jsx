"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography, Divider, message } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
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
        router.push("/"); // Chuyển về trang chủ sau khi đăng nhập
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error("Đăng nhập thất bại. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-sky-200 to-white">
      {/* Left section - logo and intro (full width on desktop) */}
      <div className="hidden md:flex md:w-3/5 bg-sky-400 text-white p-8 flex-col justify-center items-center">
        <div className="max-w-2xl mx-auto text-center">

          <Title level={1} style={{ color: "white", marginBottom: "1.5rem", fontSize: "2.5rem" }}>
            Jupiter Store POS
          </Title>
          <Paragraph
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1.25rem",
              maxWidth: "700px",
              margin: "0 auto 2rem",
            }}
          >
            Nền tảng quản lý bán hàng hiện đại giúp doanh nghiệp của bạn phát triển nhanh chóng và
            hiệu quả.
          </Paragraph>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-500 bg-opacity-30 p-6 rounded-lg">
              <Text style={{ color: "white", fontStyle: "italic", fontSize: "1.1rem" }}>
                "Hệ thống POS của Jupiter đã giúp doanh thu của chúng tôi tăng 30% chỉ trong 3
                tháng."
              </Text>
              <div className="mt-4">
                <Text strong style={{ color: "white", fontSize: "1rem" }}>
                  Nguyễn Văn A
                </Text>
                <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>CEO, Shop ABC</div>
              </div>
            </div>

            <div className="bg-blue-500 bg-opacity-30 p-6 rounded-lg">
              <Text style={{ color: "white", fontStyle: "italic", fontSize: "1.1rem" }}>
                "Quản lý kho hàng trở nên dễ dàng hơn bao giờ hết với Jupiter POS."
              </Text>
              <div className="mt-4">
                <Text strong style={{ color: "white", fontSize: "1rem" }}>
                  Trần Thị B
                </Text>
                <div style={{ color: "rgba(255, 255, 255, 0.7)" }}>Quản lý, Cửa hàng XYZ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - login form (fullscreen on mobile) */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-4 md:p-8 min-h-screen md:min-h-0">
        <Card
          style={{
            width: "100%",
            maxWidth: "450px",
            borderRadius: "16px",
          }}
          className="shadow-drop"
        >
          <div className="text-center mb-8">
            <Title level={3} style={{ fontSize: "1.75rem", marginBottom: "4px" }}>
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
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email"
                style={{
                  borderRadius: "12px",
                  height: "54px",
                  padding: "8px 16px",
                  fontSize: "1rem",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Mật khẩu"
                style={{
                  borderRadius: "12px",
                  height: "54px",
                  padding: "8px 16px",
                  fontSize: "1rem",
                }}
              />
            </Form.Item>

            <Form.Item>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
                style={{
                  height: "54px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Divider plain style={{ margin: "16px 0 24px" }}>
              <Text type="secondary" style={{ fontSize: "0.95rem" }}>
                Hoặc tiếp tục với
              </Text>
            </Divider>

            <div className="grid grid-cols-2 gap-4">
              <Button
                icon={<GoogleOutlined style={{ fontSize: "1.2rem" }} />}
                size="large"
                className="flex items-center justify-center"
                style={{
                  borderRadius: "12px",
                  height: "48px",
                  borderColor: "#eaeaea",
                  color: "#555",
                }}
              >
                Google
              </Button>
              <Button
                icon={<FacebookOutlined style={{ fontSize: "1.2rem" }} />}
                size="large"
                className="flex items-center justify-center"
                style={{
                  borderRadius: "12px",
                  height: "48px",
                  borderColor: "#eaeaea",
                  color: "#3b5998",
                }}
              >
                Facebook
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
