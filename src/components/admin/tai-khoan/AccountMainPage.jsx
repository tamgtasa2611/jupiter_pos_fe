"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Space,
  Avatar,
  Typography,
  Button,
  Divider,
  Modal,
} from "antd";
import { UserOutlined, LockOutlined, EditOutlined } from "@ant-design/icons";
import ChangePasswordForm from "./ChangePasswordForm";
import { getUserFromToken, updateUserInToken } from "@/utils/utils";
import { USER_ROLES_MAP } from "@/constants/user";
import { getUserById } from "@/requests/user";
import UpdateUserForm from "./UpdateUserForm";
const { Title, Text } = Typography;

const AccountMainPage = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateInfo, setShowUpdateInfo] = useState(false);
  const user = getUserFromToken();
  const [fullName, setFullName] = useState(user?.fullName || "-");
  const [email, setEmail] = useState(user?.email || "-");
  const [phone, setPhone] = useState(user?.phone || "-");
  const [role, setRole] = useState(
    user?.role ? USER_ROLES_MAP[user.role] : "Người dùng",
  );

  const fetchUserData = async () => {
    try {
      const userData = await getUserById(user.id);
      if (userData) {
        setFullName(userData.fullName || "-");
        setEmail(userData.email || "-");
        setPhone(userData.phone || "-");
        setRole(userData.role ? USER_ROLES_MAP[userData.role] : "Người dùng");
        updateUserInToken(userData);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Card className="transition-shadow h-fit-screen">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "24px",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <Title level={3}>Thông tin cá nhân</Title>
            <Divider style={{ margin: "12px 0" }} />
            <Space align="center" size="middle">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1677ff" }}
              />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {fullName}
                </Title>
                <Text style={{ display: "block" }}>{email}</Text>
                <Text style={{ display: "block" }}>{phone}</Text>
                <Text style={{ display: "block" }}>Vai trò: {role}</Text>
              </div>
            </Space>
          </div>
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              icon={<LockOutlined />}
              size="large"
              onClick={() => setShowChangePassword(true)}
            >
              Đổi mật khẩu
            </Button>
          </div>
          <div style={{ marginTop: 16, marginLeft: 9 }}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="large"
              onClick={() => setShowUpdateInfo(true)}
            >
              Cập nhật thông tin
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        title="Đổi mật khẩu"
        open={showChangePassword}
        onCancel={() => setShowChangePassword(false)}
        footer={null}
        centered
        width={600}
      >
        <ChangePasswordForm />
      </Modal>

      <Modal
        title="Cập nhật thông tin cá nhân"
        open={showUpdateInfo}
        onCancel={() => setShowUpdateInfo(false)}
        footer={null}
        centered
        width={600}
      >
        <UpdateUserForm fetchUserData={fetchUserData} />
      </Modal>
    </>
  );
};

export default AccountMainPage;
