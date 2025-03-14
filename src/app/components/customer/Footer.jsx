"use client";

import { Row, Col, Typography, Space } from "antd";
import {
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  RightOutlined,
  TikTokOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

const { Title, Paragraph } = Typography;

const Footer = () => {
  return (
    <footer>
      <div className="bg-gray-900 text-gray-400 pt-16 pb-8 px-4 overflow-hidden">
        <div className="container mx-auto">
          <Row gutter={[48, 48]}>
            <Col xs={24} md={8} lg={7}>
              <div className="mb-8">
                {/* Logo */}
                <Link href="/" className="inline-block mb-4">
                  <div className="bg-white text-gray-900 py-2 px-4 rounded-lg font-bold text-2xl inline-flex items-center">
                    <span className="text-sky-700">J</span>UPITER
                  </div>
                </Link>
                <Paragraph className="text-gray-400 mb-6" style={{ color: "white" }}>
                  Thương hiệu thời trang local brand hàng đầu với sứ mệnh mang đến phong cách trẻ
                  trung, năng động và cá tính cho giới trẻ Việt Nam.
                </Paragraph>
                <div className="flex space-x-4 mb-8">
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <FacebookFilled className="text-lg text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                  >
                    <InstagramFilled className="text-lg text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black transition-colors"
                  >
                    <TikTokOutlined className="text-lg text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <YoutubeFilled className="text-lg text-white" />
                  </Link>
                </div>
              </div>

              <div>
                <Title level={5} className="text-white mb-4" style={{ color: "white" }}>
                  Liên hệ với chúng tôi
                </Title>
                <Space direction="vertical" size="middle">
                  <div className="flex items-start">
                    <PhoneOutlined className="text-blue-500 mt-1 mr-3" />
                    <div>
                      <div className="text-white font-medium mb-1">Hotline</div>
                      <a
                        href="tel:0123456789"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        0123 456 789
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MailOutlined className="text-blue-500 mt-1 mr-3" />
                    <div>
                      <div className="text-white font-medium mb-1">Email</div>
                      <a
                        href="mailto:contact@jupiter.com"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        contact@jupiter.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <EnvironmentOutlined className="text-blue-500 mt-1 mr-3" />
                    <div>
                      <div className="text-white font-medium mb-1">Địa chỉ</div>
                      <address className="text-gray-400 not-italic">
                        Số 123 Đường ABC, Quận 1<br />
                        TP. Hồ Chí Minh, Việt Nam
                      </address>
                    </div>
                  </div>
                </Space>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8} lg={5}>
              <Title level={5} className="text-white mb-6" style={{ color: "white" }}>
                Danh mục
              </Title>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Sản phẩm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Bộ sưu tập
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gioi-thieu"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lien-he"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={8} lg={5}>
              <Title level={5} className="text-white mb-6" style={{ color: "white" }}>
                Chính sách & Hỗ trợ
              </Title>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/chinh-sach-doi-tra"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link
                    href="/huong-dan-mua-hang"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Hướng dẫn mua hàng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/thanh-toan-va-van-chuyen"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Thanh toán & Vận chuyển
                  </Link>
                </li>
                <li>
                  <Link
                    href="/thanh-vien"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Chương trình thành viên
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <RightOutlined className="text-xs mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    Câu hỏi thường gặp
                  </Link>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={24} md={24} lg={7}>
              <Title level={5} className="text-white mb-6" style={{ color: "white" }}>
                Hình thức thanh toán
              </Title>
              <div className="grid grid-cols-4 gap-3 mb-8">
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image src="/images/payment/visa.svg" width={40} height={25} alt="Visa" />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image
                    src="/images/payment/mastercard.svg"
                    width={40}
                    height={25}
                    alt="Mastercard"
                  />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image src="/images/payment/momo.svg" width={40} height={25} alt="Momo" />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image src="/images/payment/zalopay.svg" width={40} height={25} alt="ZaloPay" />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image src="/images/payment/vnpay.svg" width={40} height={25} alt="VNPay" />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image src="/images/payment/cod.svg" width={40} height={25} alt="COD" />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image
                    src="/images/payment/bank.svg"
                    width={40}
                    height={25}
                    alt="Bank Transfer"
                  />
                </div>
              </div>

              <Title level={5} className="text-white mb-6" style={{ color: "white" }}>
                Đối tác vận chuyển
              </Title>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image src="/images/shipping/ghn.svg" width={40} height={25} alt="GHN" />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image src="/images/shipping/ghtk.svg" width={40} height={25} alt="GHTK" />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image
                    src="/images/shipping/viettelpost.svg"
                    width={40}
                    height={25}
                    alt="ViettelPost"
                  />
                </div>
                <div className="bg-white p-2 rounded flex items-center justify-center">
                  <Image src="/images/shipping/jnt.svg" width={40} height={25} alt="J&T Express" />
                </div>
              </div>
            </Col>
          </Row>

          <div className="h-px bg-gray-800 my-8"></div>

          <Row justify="space-between" align="middle" className="flex-col md:flex-row">
            <Col className="mb-4 md:mb-0">
              <p className="text-gray-500 mb-0">
                © {new Date().getFullYear()} Jupiter Store. Tất cả các quyền được bảo lưu.
              </p>
            </Col>
            <Col>
              <div className="flex items-center text-gray-500">
                <span>Được thiết kế và phát triển bởi T & T</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
