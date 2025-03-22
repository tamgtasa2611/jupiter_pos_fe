"use client";

import "@ant-design/v5-patch-for-react-19";
import { Layout } from "antd";
import LoginForm from "@components/customer/login/LoginPage";

const { Content } = Layout;

export default function LoginPage() {
  return (
    <Layout className="h-screen">
      <Content>
        <LoginForm />
      </Content>
    </Layout>
  );
}
