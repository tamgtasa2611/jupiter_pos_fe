"use client";

import "@ant-design/v5-patch-for-react-19";
import { Layout } from "antd";
import LoginPage from "@components/common/login/LoginPage";

const { Content } = Layout;

export default function Page() {
  return (
    <Layout className="h-screen">
      <Content>
        <LoginPage />
      </Content>
    </Layout>
  );
}
