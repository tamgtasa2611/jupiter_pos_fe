"use client";

import "@ant-design/v5-patch-for-react-19";
import { Layout, App } from "antd";

const { Content } = Layout;

export default function LoginLayout({ children }) {
  return (
    <Layout className="h-dvh">
      <Content className="bg-gray-50/50 overflow-y-auto h-full">
        <App>{children}</App>
      </Content>
    </Layout>
  );
}
