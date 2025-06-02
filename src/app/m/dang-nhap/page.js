"use client";

import { Layout } from "antd";
import MobileLoginPage from "@components/common/login/MobileLoginPage";

const { Content } = Layout;

export default function Login() {
  return (
    <Layout className="h-screen">
      <Content>
        <MobileLoginPage />
      </Content>
    </Layout>
  );
}
