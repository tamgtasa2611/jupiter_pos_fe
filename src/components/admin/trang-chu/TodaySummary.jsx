import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Space } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
import { getReveneues } from "@requests/statistic";

const TodaySummary = () => {
  const [todayData, setTodayData] = useState({
    todayRevenue: 0,
    todayProfit: 0,
    netRevenue: 0,
    comparedToYesterday: 0,
    comparedToLastMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  const todayStaticData = {
    invoiceCount: 20,
    returns: 0,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getReveneues();
        setTodayData({
          todayRevenue: data.todayRevenue ?? 0,
          todayProfit: data.todayProfit ?? 0,
          netRevenue: data.thisMonthRevenue ?? 0, // hoặc bạn muốn hiển thị gì
          comparedToYesterday: data.todayChangePercent ?? 0,
          comparedToLastMonth: data.thisMonthChangePercent ?? 0,
        });
      } catch (error) {
        setTodayData({
          todayRevenue: 0,
          todayProfit: 0,
          netRevenue: 0,
          comparedToYesterday: 0,
          comparedToLastMonth: 0,
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Card
      title={
        <Space>
          <DollarOutlined />
          <span>Kết quả bán hàng hôm nay</span>
        </Space>
      }
      className="transition-shadow"
    >
      <Row
        gutter={[24, 16]}
        align="middle"
        className="flex-nowrap overflow-x-auto pb-2"
      >
        <Col xs={12} sm={6} lg={4}>
          <Statistic
            title={<Title level={5}>Doanh thu</Title>}
            value={loading ? "..." : formatCurrency(todayData.todayRevenue)}
            prefix="₫"
            valueStyle={{ color: "#3f8600", fontSize: "18px" }}
          />
          <Text type="secondary" className="block">
            {todayStaticData.invoiceCount} hóa đơn
          </Text>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Statistic
            title={<Title level={5}>Lợi nhuận</Title>}
            value={loading ? "..." : formatCurrency(todayData.todayProfit)}
            prefix="₫"
            valueStyle={{ color: "#3f8600", fontSize: "18px" }}
          />
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Statistic
            title={<Title level={5}>Trả hàng</Title>}
            value={formatCurrency(todayStaticData.returns)}
            prefix="₫"
            valueStyle={{ fontSize: "18px" }}
          />
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Statistic
            title={<Title level={5}>Doanh thu tháng này </Title>}
            value={loading ? "..." : formatCurrency(todayData.netRevenue)}
            prefix="₫"
            valueStyle={{ color: "#1677ff", fontSize: "18px" }}
          />
        </Col>

        <Col xs={12} sm={8} lg={4}>
          <Statistic
            title={<Text type="secondary">So với hôm qua</Text>}
            value={loading ? "..." : todayData.comparedToYesterday}
            precision={2}
            valueStyle={{
              color:
                todayData.comparedToYesterday >= 0 ? "#3f8600" : "#cf1322",
              fontSize: "18px",
            }}
            prefix={
              todayData.comparedToYesterday >= 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            suffix="%"
          />
        </Col>

        <Col xs={12} sm={8} lg={4}>
          <Statistic
            title={<Text type="secondary">So với tháng trước</Text>}
            value={loading ? "..." : todayData.comparedToLastMonth}
            precision={2}
            valueStyle={{
              color:
                todayData.comparedToLastMonth >= 0 ? "#3f8600" : "#cf1322",
              fontSize: "18px",
            }}
            prefix={
              todayData.comparedToLastMonth >= 0 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            suffix="%"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default TodaySummary;
