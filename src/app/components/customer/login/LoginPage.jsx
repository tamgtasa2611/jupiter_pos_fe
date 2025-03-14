"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography, Divider, message } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Giả lập API call đăng nhập - thay thế bằng API thực tế sau này
      console.log("Login values:", values);

      // Giả lập đăng nhập thành công
      setTimeout(() => {
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
    <Card className="max-w-md w-full mx-auto shadow-md">
      <div className="text-center mb-6">
        <Title level={2} className="mb-1">
          Đăng nhập
        </Title>
        <Text className="text-gray-500">Chào mừng bạn đã quay trở lại với Jupiter Store</Text>
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
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link href="/forgot-password" className="text-blue-500 hover:text-blue-700">
              Quên mật khẩu?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>

        <div className="text-center mb-4">
          <Text className="text-gray-500">
            Chưa có tài khoản?
            <Link href="/dang-ky" className="text-blue-500 hover:text-blue-700 ml-1">
              Đăng ký ngay
            </Link>
          </Text>
        </div>

        <Divider plain>Hoặc đăng nhập với</Divider>

        <div className="flex justify-center space-x-4">
          <Button
            icon={<GoogleOutlined />}
            size="large"
            className="flex items-center justify-center"
          >
            Google
          </Button>
          <Button
            icon={<FacebookOutlined />}
            size="large"
            className="flex items-center justify-center"
          >
            Facebook
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default LoginForm;
