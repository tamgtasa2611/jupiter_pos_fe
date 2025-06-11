"use client";

import React from "react";
import { Layout } from "antd";
import StatisticMenu from "./StatisticMenu";
import AdminDashboard from "../trang-chu/AdminDashboard";
import DailyReport from "./DailyReport";
import SalesReport from "./SalesReport";
import { usePathname } from "next/navigation";

const { Content, Sider } = Layout;

const MainStatisticsPage = () => {
  const pathname = usePathname();

  let content;
  switch (pathname) {
    case "/admin/thong-ke/ban-hang":
      content = <DailyReport />;
      break;
    case "/admin/thong-ke/nhan-vien":
      content = <SalesReport />;
      break;
    case "/admin/thong-ke/hang-hoa":
      content = <AdminDashboard />;
      break;
    case "/admin/thong-ke/khach-hang":
      content = <AdminDashboard />;
      break;
    case "/admin/thong-ke/don-hang":
      content = <AdminDashboard />;
      break;
    default:
      content = <AdminDashboard />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#fff" }}>
        <StatisticMenu />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "0 16px",
            padding: 24,
            background: "#fff",
            minHeight: 360,
          }}
        >
          {content}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainStatisticsPage;
