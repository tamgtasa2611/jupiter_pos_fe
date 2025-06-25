"use client";

import React, { useState } from "react";
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
import { getUserFromToken } from "@/utils/utils";
import { USER_ROLES_MAP } from "@/constants/user";
import UpdateUserForm from "./UpdateUserForm";
const { Title, Text } = Typography;

const AccountMainPage = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateInfo, setShowUpdateInfo] = useState(false);
  const user = getUserFromToken();
  const fullName = user?.fullName || "-";
  const email = user?.email || "-";
  const phone = user?.phone || "-";
  const role = user?.role ? USER_ROLES_MAP[user.role] : "Người dùng";

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
        <UpdateUserForm />
      </Modal>
    </>
  );
};

export default AccountMainPage;
