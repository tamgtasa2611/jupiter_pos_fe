"use client";

import React, { useState } from "react";
import { Typography, Button, Avatar, Divider, InputNumber } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ChangePasswordForm from "./ChangePasswordForm";
import { getUserFromToken } from "@/utils/utils";

const { Title, Text } = Typography;

const AccountMainPage = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  const user = getUserFromToken();
  const fullName = user?.fullName || "-";
  const email = user?.email || null;
  const phone = user?.phone || null;
  const role = user?.role || "Người dùng";

return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-6 bg-gray-50 min-h-[70vh]">
    
    {/* Cột trái: Thông tin cá nhân */}
    <div className="space-y-2">
      <div className="flex items-center space-x-3 mb-2">
        <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: "#1677ff" }} />
        <Title level={5} className="mb-0">{fullName}</Title>
      </div>
      <Text type="secondary" className="block">{email}</Text>
      <Text type="secondary" className="block">{phone}</Text>
      <Text className="block font-semibold text-blue-600">{role}</Text>

      <Button
        type="primary"
        icon={<LockOutlined />}
        size="middle"
        onClick={() => setShowChangePassword((v) => !v)}
        className="mt-4"
      >
        Đổi mật khẩu
      </Button>
    </div>

    {/* Cột phải: Form đổi mật khẩu */}
    {showChangePassword && (
      <div>
        <div className="flex items-center mb-3">
          <ChangePasswordForm />
        </div>
      </div>
    )}
  </div>
);
};

export default AccountMainPage;