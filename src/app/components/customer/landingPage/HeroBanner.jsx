"use client";

import { Button, Typography, Space, Row, Col } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HeroBanner = () => {
  return (
    <div className="hero-section min-h-[600px] flex items-center relative bg-[#f8f9fa]">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(hero.jpg)" }}
      ></div>
      <div className="container mx-auto px-4 z-10">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12}>
            <div className="py-10">
              <Space direction="vertical" size="large">
                <div>
                  <Title level={2} className="text-4xl md:text-5xl font-bold mb-2">
                    Khám phá phong cách thời trang mới
                  </Title>
                  <Title level={1} className="text-5xl md:text-6xl font-bold">
                    Jupiter Store
                  </Title>
                </div>
                <Paragraph className="text-lg mb-8">
                  Bộ sưu tập mới nhất với thiết kế độc đáo và chất lượng cao. Tìm kiếm phong cách
                  của riêng bạn cùng Jupiter Store.
                </Paragraph>
                <Space>
                  <Button type="primary" size="large" shape="round">
                    Mua sắm ngay
                  </Button>
                  <Button type="link" size="large">
                    Xem BST mới <ArrowRightOutlined />
                  </Button>
                </Space>
              </Space>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="flex justify-center">
              <img
                src="shirt.webp"
                alt="Jupiter fashion collection"
                className="max-h-[500px] object-contain"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroBanner;
