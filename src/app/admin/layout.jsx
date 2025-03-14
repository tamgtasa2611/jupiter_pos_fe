"use client";

import React from "react";
import { Layout } from "antd";
import NavBar from "../components/admin/common/NavBar";
import MobileNavBar from "../components/admin/common/MobileNavBar";

const { Content } = Layout;

export default function AdminLayout({ children }) {
  return (
    <Layout className="min-h-screen">
      <NavBar />
      <Content className="p-4 md:p-6 bg-sky-50">{children}</Content>
      <MobileNavBar />
    </Layout>
  );
}
