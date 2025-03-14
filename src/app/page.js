"use client";
import "@ant-design/v5-patch-for-react-19";

import { Layout } from "antd";
import Header from "./components/customer/Header";
import HeroBanner from "./components/customer/landingPage/HeroBanner";
import Features from "./components/customer/landingPage/Features";
import ProductShowcase from "./components/customer/landingPage/ProductShowcase";
import Testimonials from "./components/customer/landingPage/Testimonials";
import Newsletter from "./components/customer/landingPage/Newsletter";
import Footer from "./components/customer/Footer";

const { Content } = Layout;

export default function CustomerLandingPage() {
  return (
    <Layout className="landing-page App">
      <Header />
      <Content>
        <HeroBanner />
        <Features />
        <ProductShowcase />
        <Testimonials />
        <Newsletter />
      </Content>
      <Footer />
    </Layout>
  );
}
