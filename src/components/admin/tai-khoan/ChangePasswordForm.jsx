"use client";

import React, { useState } from "react";
import { Form, Input, Button, Alert, App } from "antd";
import { generateOtp, verifyOtpAndChangePws } from "@/requests/user";
import { useRouter } from "next/navigation";

const ChangePasswordForm = () => {
  const { message } = App.useApp();
  const [loginInfo, setLoginInfo] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const router = useRouter();

  const validateLoginInfo = (info) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    return emailRegex.test(info) || phoneRegex.test(info);
  };

  const handleGenerateOtp = async () => {
    setLoadingOtp(true);
    setAlertMessage("");

    if (!validateLoginInfo(loginInfo)) {
      message.error("Vui lòng nhập đúng email hoặc số điện thoại");
      setLoadingOtp(false);
      return;
    }

    try {
      await generateOtp({ loginInfo });
      setAlertMessage("Đã gửi OTP đến email hoặc số điện thoại của bạn.");
      setMessageType("success");
    } catch (error) {
      let errorMessage = "Gửi mã OTP thất bại.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      setAlertMessage(errorMessage);
      setMessageType("error");
    }
    setLoadingOtp(false);
  };

  const onFinish = async (values) => {
    setLoadingSubmit(true);
    setAlertMessage("");
    try {
      const res = await verifyOtpAndChangePws({
        otp: values.otp,
        newPassword: values.newPassword,
      });
      if (res) {
        message.error(res || "Đổi mật khẩu thất bại!");
        return;
      }
      setAlertMessage("Đổi mật khẩu thành công.");
      setMessageType("success");
      setTimeout(() => {
        router.push("/dang-nhap"); // Chuyển về trang đăng nhập sau khi thành công
      }, 1000);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Đổi mật khẩu thất bại.";
      message.error(errorMessage);
      setAlertMessage(errorMessage);
      setMessageType("error");
    }
    setLoadingSubmit(false);
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Email hoặc Số điện thoại"
        name="loginInfo"
        rules={[
          { required: true, message: "Vui lòng nhập email hoặc số điện thoại" },
        ]}
      >
        <Input
          placeholder="Nhập email hoặc số điện thoại"
          value={loginInfo}
          onChange={(e) => setLoginInfo(e.target.value)}
          size="large"
        />
      </Form.Item>

      <Form.Item label="Mã OTP" required>
        <div style={{ display: "flex", gap: "8px" }}>
          <Form.Item
            name="otp"
            noStyle
            rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
          >
            <Input placeholder="Nhập mã OTP" size="large" />
          </Form.Item>
          <Button
            type="primary"
            onClick={handleGenerateOtp}
            loading={loadingOtp}
            disabled={!loginInfo}
            size="large"
          >
            Gửi OTP
          </Button>
        </div>
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="newPassword"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
      >
        <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loadingSubmit}
          block
          size="large"
        >
          Xác nhận đổi mật khẩu
        </Button>
      </Form.Item>
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={messageType}
          showIcon
          style={{ marginTop: "16px" }}
        />
      )}
    </Form>
  );
};

export default ChangePasswordForm;
