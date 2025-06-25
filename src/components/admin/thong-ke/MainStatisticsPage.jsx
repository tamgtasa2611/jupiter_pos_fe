"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import StatisticMenu from "./StatisticMenu";
import AdminDashboard from "../trang-chu/AdminDashboard";
import CustomerReport from "./CustomerReport";
import { usePathname } from "next/navigation";

const { Content, Sider } = Layout;

const MainStatisticsPage = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState < JSX.Element > <></>;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    switch (pathname) {
      case "/admin/thong-ke/ban-hang":
        setContent(<AdminDashboard />);
        break;
      case "/admin/thong-ke/khach-hang":
        setContent(<CustomerReport />);
        break;
      default:
        setContent(<AdminDashboard />);
    }
  }, [pathname]);

  if (!mounted) return null;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#fff" }}>
        <StatisticMenu />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "0 16px",
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
