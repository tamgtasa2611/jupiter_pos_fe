"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Image,
  Button,
  Divider,
  Skeleton,
  Space,
  Statistic,
  Tooltip,
  Row,
  Col,
  Badge,
  Progress,
  List,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  BarcodeOutlined,
  PrinterOutlined,
  ShopOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  FireOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  EyeOutlined,
} from "@ant-design/icons";

// Import your API function to fetch product details
import { getProductVariantById } from "@/requests/product";

const { Title, Text } = Typography;

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const productId = params?.id;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Call your real API to get product details
        const data = await getProductVariantById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <Card className="w-full">
        <Skeleton active avatar paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="w-full" style={{ textAlign: "center" }}>
        <Title level={4}>Không tìm thấy sản phẩm</Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          type="primary"
        >
          Quay lại
        </Button>
      </Card>
    );
  }

  // Calculate stock percentage based on quantity and maxStock
  const stockPercent = Math.min(
    100,
    Math.round((product.quantity / (product.maxStock || 500)) * 100),
  );

  return (
    <div className="w-full">
      <Card
        bodyStyle={{ padding: 0 }}
        variant="borderless"
        className="overflow-hidden"
        style={{ boxShadow: "0 2px 8px #f0f1f2" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "24px 24px 0 24px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafcff",
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            type="text"
            style={{ marginRight: 8 }}
          />
          <Title level={4} style={{ margin: 0, flex: 1 }}>
            {product.name}
            {product.originName && (
              <Tag color="blue" style={{ marginLeft: 12 }}>
                Sản phẩm gốc: {product.originName}
              </Tag>
            )}
            {product.bestSeller && (
              <Tag color="volcano" style={{ marginLeft: 12 }}>
                <FireOutlined /> Bán chạy
              </Tag>
            )}
            {/* {product.tags?.map((tag, idx) => (
              <Tag key={idx} color="blue" style={{ marginLeft: 8 }}>
                {tag.tagName || tag.name || JSON.stringify(tag)}
              </Tag>
            ))} */}
          </Title>
          <Space>
            <Tooltip title="In mã vạch">
              <Button icon={<PrinterOutlined />} />
            </Tooltip>
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={() => router.push(`/admin/hang-hoa/${product.id}/edit`)}
            >
              Chỉnh sửa
            </Button>
          </Space>
        </div>

        {/* Main content */}
        <Row gutter={[32, 0]} style={{ padding: 32 }}>
          {/* Left: Image & quick info */}
          <Col xs={24} md={7} lg={6}>
            <div className="flex flex-col items-center">
              <Badge.Ribbon
                text={product.isActive ? "Đang bán" : "Ngừng bán"}
                color={product.isActive ? "green" : "red"}
              >
                <Image
                  alt={product.name}
                  src={product.image || null}
                  className="rounded"
                  style={{
                    maxHeight: 220,
                    objectFit: "contain",
                    background: "#fff",
                  }}
                  fallback="https://via.placeholder.com/220x220?text=No+Image"
                  preview
                />
              </Badge.Ribbon>
              <Space direction="vertical" size={8} className="mt-4 w-full">
                <Statistic
                  title="Tồn kho"
                  value={product.quantity}
                  suffix={product.unit}
                  valueStyle={{
                    color:
                      product.quantity < 10
                        ? "#ff4d4f"
                        : product.quantity < 30
                          ? "#faad14"
                          : "#52c41a",
                  }}
                  prefix={<BarcodeOutlined />}
                />
                <Progress
                  percent={stockPercent}
                  status={
                    product.quantity < product.minStock
                      ? "exception"
                      : product.quantity > product.maxStock
                        ? "active"
                        : "normal"
                  }
                  size="small"
                  showInfo={false}
                  style={{ marginBottom: 0 }}
                />
                <Statistic
                  title="Giá bán"
                  value={product.price}
                  suffix="đ"
                  valueStyle={{ color: "#1677ff" }}
                  prefix={<DollarOutlined />}
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN").format(value)
                  }
                />
                <Statistic
                  title="Giá nhập"
                  value={product.costPrice}
                  suffix="đ"
                  prefix={<ShopOutlined />}
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN").format(value)
                  }
                />
                <Divider style={{ margin: "12px 0" }} />
                <Space direction="vertical" size={0} style={{ width: "100%" }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Lần bán gần nhất:{" "}
                    <span style={{ color: "#1677ff" }}>{product.lastSold}</span>
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Lần nhập gần nhất:{" "}
                    <span style={{ color: "#52c41a" }}>
                      {product.lastImported}
                    </span>
                  </Text>
                </Space>
              </Space>
            </div>
          </Col>

          {/* Right: Product Information */}
          <Col xs={24} md={17} lg={18}>
            <Descriptions
              bordered
              column={2}
              size="small"
              className="bg-white"
              labelStyle={{ width: 160 }}
              contentStyle={{ fontWeight: 500 }}
            >
              <Descriptions.Item label="Mã sản phẩm">
                <Space>
                  <BarcodeOutlined />
                  <span className="font-mono">{product.barcode}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Mã nội bộ">
                <Text code>{product.internalCode}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Barcode phụ">
                <Space>
                  {product.extraBarcodes &&
                    product.extraBarcodes.map((b) => (
                      <Tag key={b} color="blue">
                        {b}
                      </Tag>
                    ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                <Tag color="purple">{product.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Nhà cung cấp">
                <Space>
                  <UserOutlined />
                  {product.supplier}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                <Space>
                  <CalendarOutlined />
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={product.isActive ? "green" : "red"}>
                  {product.isActive ? "Đang bán" : "Ngừng bán"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Loại sản phẩm">
                <Tag color="cyan">
                  <AppstoreOutlined /> Sản phẩm đóng gói
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {/* Product Description */}
            <Divider orientation="left" plain className="mt-6 mb-2">
              Mô tả sản phẩm
            </Divider>
            <div className="bg-gray-50 p-3 rounded mb-4 min-h-[48px]">
              {product.description || (
                <Text type="secondary">Không có mô tả</Text>
              )}
            </div>

            {/* Related Products */}
            <Divider orientation="left" plain className="mt-6 mb-2">
              Sản phẩm liên quan
            </Divider>
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={product.relatedProducts}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => router.push(`/admin/hang-hoa/${item.id}`)}
                  >
                    <Space>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <span>{item.name}</span>
                      <span style={{ color: "#1677ff" }}>
                        {item.price.toLocaleString()}đ
                      </span>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        </Row>

        {/* Sales Management Info */}
        <Divider orientation="left" plain className="mt-0 mb-2">
          Thông tin quản lý bán hàng
        </Divider>
        <Row gutter={[24, 24]} style={{ padding: "0 32px 32px 32px" }}>
          <Col xs={24} md={12}>
            <Card bordered={false} style={{ background: "#f6ffed" }}>
              <Statistic
                title="Doanh số tháng này"
                value={product.salesMonth}
                suffix={product.unit}
                valueStyle={{ color: "#52c41a" }}
                prefix={<FireOutlined />}
              />
              <Statistic
                title="Tổng doanh số"
                value={product.salesTotal}
                suffix={product.unit}
                valueStyle={{ color: "#1677ff" }}
                className="mt-2"
                prefix={<FireOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered={false} style={{ background: "#fffbe6" }}>
              <Title level={5} style={{ marginBottom: 8 }}>
                Lịch sử nhập/xuất gần đây
              </Title>
              <div>
                <Text strong>Nhập kho:</Text>
                {/* Import History */}
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {(product.importHistory || []).map((item, idx) => (
                    <li key={idx}>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />{" "}
                      {item.date}: +{item.qty} ({item.price.toLocaleString()}đ)
                    </li>
                  ))}
                </ul>
                <Text strong>Xuất kho:</Text>
                {/* Export History */}
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {(product.exportHistory || []).map((item, idx) => (
                    <li key={idx}>
                      <WarningOutlined style={{ color: "#faad14" }} />{" "}
                      {item.date}: -{item.qty}
                    </li>
                  ))}
                </ul>
                <Button size="small" type="link" className="mt-2">
                  Xem chi tiết
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
