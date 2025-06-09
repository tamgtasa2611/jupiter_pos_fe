"use client";

import React, { useState } from "react";
import { Input, Button, Space, Alert, message as antdMessage } from "antd";
import { generateOtp, verifyOtpAndChangePws } from "@/requests/user";

const ChangePasswordForm = () => {
  const [loginInfo, setLoginInfo] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleGenerateOtp = async () => {
    setLoadingOtp(true);
    setAlertMessage("");
    try {
      await generateOtp({ loginInfo });
      antdMessage.success("Đã gửi OTP đến email hoặc số điện thoại của bạn.");
      setAlertMessage("Đã gửi OTP đến email hoặc số điện thoại của bạn.");
      setMessageType("success");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Gửi OTP thất bại.";
      antdMessage.error(errorMessage);
      setAlertMessage(errorMessage);
      setMessageType("error");
    }
    setLoadingOtp(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setAlertMessage("");
    try {
      await verifyOtpAndChangePws({ otp, newPassword });
      antdMessage.success("Đổi mật khẩu thành công.");
      setAlertMessage("Đổi mật khẩu thành công.");
      setMessageType("success");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Đổi mật khẩu thất bại.";
      antdMessage.error(errorMessage);
      setAlertMessage(errorMessage);
      setMessageType("error");
    }
    setLoadingSubmit(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Space direction="vertical" size="middle" className="w-full">
        <Input
          type="email"
          placeholder="Nhập email hoặc số điện thoại"
          value={loginInfo}
          onChange={(e) => setLoginInfo(e.target.value)}
          required
          size="large"
        />
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            size="large"
          />
          <Button
            type="primary"
            onClick={handleGenerateOtp}
            loading={loadingOtp}
            disabled={!loginInfo}
            block
          >
            Gửi OTP
          </Button>
        </div>
        <Input.Password
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          size="large"
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={loadingSubmit}
          block
        >
          Xác nhận đổi mật khẩu
        </Button>
        {alertMessage && (
          <Alert
            message={alertMessage}
            type={messageType}
            showIcon
            className="mt-2"
          />
        )}
      </Space>
    </form>
  );
};

export default ChangePasswordForm;