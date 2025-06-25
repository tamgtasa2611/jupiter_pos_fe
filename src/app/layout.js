import { AntdRegistry } from "@ant-design/nextjs-registry";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConfigProvider, App } from "antd";
import themeConfig from "@config/themeConfig";
import Script from "next/script";
import viVN from "antd/locale/vi_VN";
import "@ant-design/v5-patch-for-react-19";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Phần mềm quản lý bán hàng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider theme={themeConfig} locale={viVN}>
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
