"use client";

import { useState } from "react";
import { Row, Col, Card, Typography, Button, Tabs, Badge, Rate } from "antd";
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      hoverable
      className="product-card relative overflow-hidden h-full"
      cover={
        <div
          className="relative overflow-hidden pt-[120%]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            alt={product.name}
            src={product.image}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered && product.hoverImage ? "scale(0)" : "scale(1)" }}
          />
          {product.hoverImage && (
            <img
              alt={`${product.name} hover`}
              src={product.hoverImage}
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1)" : "scale(0)" }}
            />
          )}

          {product.discount && (
            <Badge.Ribbon
              text={`-${product.discount}%`}
              color="red"
              className="absolute top-3 left-0"
            />
          )}

          <div
            className={`product-actions absolute bottom-4 left-0 right-0 flex justify-center gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Button shape="circle" icon={<ShoppingCartOutlined />} />
            <Button shape="circle" icon={<HeartOutlined />} />
            <Button shape="circle" icon={<EyeOutlined />} />
          </div>
        </div>
      }
    >
      <div className="text-center">
        <Paragraph className="text-sm text-gray-500 mb-1">{product.category}</Paragraph>
        <Title level={5} className="mb-1">
          {product.name}
        </Title>
        <div className="flex justify-center mb-2">
          <Rate disabled defaultValue={product.rating} size="small" />
        </div>
        <div className="flex justify-center items-center gap-2">
          {product.originalPrice && (
            <span className="text-gray-400 line-through">
              {product.originalPrice.toLocaleString()}đ
            </span>
          )}
          <span className="font-semibold text-red-500">{product.price.toLocaleString()}đ</span>
        </div>
      </div>
    </Card>
  );
};

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      name: "Áo Thun Basic",
      price: 250000,
      originalPrice: 320000,
      discount: 22,
      image: "shirt.webp",
      hoverImage: "shirt.webp",
      category: "Áo",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Quần Jean Nam Slim Fit",
      price: 450000,
      image: "shirt.webp",
      hoverImage: "shirt.webp",
      category: "Quần",
      rating: 5,
    },
    {
      id: 3,
      name: "Áo Khoác Bomber",
      price: 650000,
      originalPrice: 850000,
      discount: 24,
      image: "shirt.webp",
      hoverImage: "shirt.webp",
      category: "Áo khoác",
      rating: 4,
    },
    {
      id: 4,
      name: "Váy Liền Nữ",
      price: 380000,
      image: "shirt.webp",
      hoverImage: "shirt.webp",
      category: "Váy",
      rating: 4.5,
    },
  ];

  const tabItems = [
    {
      key: "1",
      label: "Mới nhất",
      children: null, // We're handling content outside of tabs
    },
    {
      key: "2",
      label: "Bán chạy",
      children: null,
    },
    {
      key: "3",
      label: "Giảm giá",
      children: null,
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Title level={2} className="mb-2">
            Sản phẩm nổi bật
          </Title>
          <Paragraph className="text-gray-600 max-w-2xl mx-auto">
            Khám phá những sản phẩm được yêu thích nhất tại Jupiter Store
          </Paragraph>
        </div>

        <Tabs defaultActiveKey="1" centered className="product-tabs mb-8" items={tabItems} />

        <Row gutter={[24, 32]}>
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={8} md={6}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        <div className="text-center mt-12">
          <Button type="primary" size="large">
            Xem tất cả sản phẩm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
