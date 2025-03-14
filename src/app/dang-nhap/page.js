"use client";

import "@ant-design/v5-patch-for-react-19";
import { Layout } from "antd";
import LoginForm from "../components/customer/login/LoginPage";

const { Content } = Layout;

export default function LoginPage() {
  return (
    <Layout className="h-screen">
      <Content className="py-16 px-4 bg-sky-50 flex justify-center items-center">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
