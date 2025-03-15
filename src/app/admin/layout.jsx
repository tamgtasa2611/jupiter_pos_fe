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
      <Content className="px-0 pb-16 md:p-6 bg-gradient-to-br from-sky-100 to-white h-full">{children}</Content>
      <MobileNavBar />
    </Layout>
  );
}
