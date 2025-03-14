import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { 
  ShoppingCartOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  DollarOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const TodaySummary = () => {
  // Example data - replace with your actual data
  const todayData = {
    revenue: 63027000,
    invoiceCount: 20,
    returns: 0,
    comparedToYesterday: 39.88,
    comparedToLastMonth: -4.58,
    netRevenue: 63027000 // Same as revenue since returns are 0
  };

  // Format currency to Vietnamese format
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <Card 
      title={
        <Space>
          <DollarOutlined />
          <span>Kết quả bán hàng hôm nay</span>
        </Space>
      }
      className="shadow-sm hover:shadow-md transition-shadow"
    >
      <Row gutter={[24, 16]} align="middle" className="flex-nowrap overflow-x-auto pb-2">
        <Col xs={12} sm={6} lg={4}>
          <Statistic
            title={<Title level={5}>Doanh thu</Title>}
            value={formatCurrency(todayData.revenue)}
            prefix="₫"
            valueStyle={{ color: '#3f8600', fontSize: '18px' }}
          />
          <Text type="secondary" className="block">{todayData.invoiceCount} hóa đơn</Text>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Statistic
            title={<Title level={5}>Trả hàng</Title>}
            value={formatCurrency(todayData.returns)}
            prefix="₫"
            valueStyle={{ fontSize: '18px' }}
          />
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Statistic
            title={<Title level={5}>Doanh thu thuần</Title>}
            value={formatCurrency(todayData.netRevenue)}
            prefix="₫"
            valueStyle={{ color: '#1677ff', fontSize: '18px', fontWeight: 'bold' }}
          />
        </Col>

        <Col xs={12} sm={8} lg={6}>
          <Statistic
            title={<Text type="secondary">So với hôm qua</Text>}
            value={todayData.comparedToYesterday}
            precision={2}
            valueStyle={{ 
              color: todayData.comparedToYesterday >= 0 ? '#3f8600' : '#cf1322',
              fontSize: '18px'
            }}
            prefix={todayData.comparedToYesterday >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="%"
          />
        </Col>

        <Col xs={12} sm={8} lg={6}>
          <Statistic
            title={<Text type="secondary">So với cùng kỳ tháng trước</Text>}
            value={todayData.comparedToLastMonth}
            precision={2}
            valueStyle={{ 
              color: todayData.comparedToLastMonth >= 0 ? '#3f8600' : '#cf1322',
              fontSize: '18px'
            }}
            prefix={todayData.comparedToLastMonth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="%"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default TodaySummary;