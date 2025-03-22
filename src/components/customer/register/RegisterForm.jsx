"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Giả lập API call đăng ký - thay thế bằng API thực tế sau này
      console.log("Register values:", values);

      // Giả lập đăng ký thành công
      setTimeout(() => {
        message.success("Đăng ký tài khoản thành công!");
        router.push("/dang-nhap"); // Chuyển đến trang đăng nhập sau khi đăng ký
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto shadow-md">
      <div className="text-center mb-6">
        <Title level={2} className="mb-1">
          Đăng ký tài khoản
        </Title>
        <Text className="text-gray-500">Tạo tài khoản để mua sắm tại Jupiter Store</Text>
      </div>

      <Form
        name="register"
        initialValues={{ agree: false }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
          <Input prefix={<UserOutlined />} placeholder="Họ tên" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có 10 chữ số!" },
          ]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Bạn phải đồng ý với điều khoản và điều kiện")),
            },
          ]}
        >
          <Checkbox>
            Tôi đồng ý với{" "}
            <Link href="/terms" className="text-blue-500 hover:text-blue-700">
              Điều khoản
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="text-blue-500 hover:text-blue-700">
              Chính sách bảo mật
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            Đăng ký
          </Button>
        </Form.Item>

        <div className="text-center mb-4">
          <Text className="text-gray-500">
            Đã có tài khoản?
            <Link href="/dang-nhap" className="text-blue-500 hover:text-blue-700 ml-1">
              Đăng nhập ngay
            </Link>
          </Text>
        </div>

        <Divider plain>Hoặc đăng ký với</Divider>

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

export default RegisterForm;
