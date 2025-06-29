"use client";

import { Layout } from "antd";
import StatisticMenu from "@/components/admin/thong-ke/StatisticMenu";

const { Content, Sider } = Layout;

export default function ThongKeLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ margin: "0", minHeight: 360 }}>
        <StatisticMenu />
        {children}
      </Content>
    </Layout>
  );
}
