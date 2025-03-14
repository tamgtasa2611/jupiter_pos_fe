"use client";

import { Col, Row, Card, Typography } from "antd";
import {
  RocketOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const FeatureCard = ({ icon, title, description }) => (
  <Card className="text-center h-full shadow-sm hover:shadow-md transition-shadow">
    <div className="text-4xl text-blue-500 mb-4">{icon}</div>
    <Title level={4}>{title}</Title>
    <Paragraph className="text-gray-600">{description}</Paragraph>
  </Card>
);

const Features = () => {
  const features = [
    {
      icon: <RocketOutlined />,
      title: "Giao hàng nhanh chóng",
      description: "Miễn phí giao hàng cho đơn hàng trên 500.000đ và giao trong 24h.",
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: "Sản phẩm chất lượng",
      description: "Cam kết 100% hàng chính hãng với chất liệu cao cấp.",
    },
    {
      icon: <CustomerServiceOutlined />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ tư vấn luôn sẵn sàng hỗ trợ mọi lúc bạn cần.",
    },
    {
      icon: <SyncOutlined />,
      title: "Đổi trả dễ dàng",
      description: "Chính sách đổi trả trong vòng 30 ngày cho mọi sản phẩm.",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Title level={2} className="mb-4">
            Tại sao chọn Jupiter Store?
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn đặt trải nghiệm khách hàng lên hàng đầu với các dịch vụ tốt nhất.
          </Paragraph>
        </div>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
              <FeatureCard {...feature} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Features;
