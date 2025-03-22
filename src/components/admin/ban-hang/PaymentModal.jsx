import React, { useState } from "react";
import {
  Modal,
  Button,
  Tabs,
  Form,
  Input,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Space,
  InputNumber,
  List,
  Tag,
  Radio,
  message,
} from "antd";
import {
  CreditCardOutlined,
  MoneyCollectOutlined,
  BankOutlined,
  MobileOutlined,
  PrinterOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const PaymentModal = ({ visible, onCancel, onComplete, totalAmount, cart }) => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState(totalAmount);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions = [
    { key: "cash", label: "Tiền mặt", icon: <MoneyCollectOutlined /> },
    { key: "card", label: "Thẻ ATM/VISA", icon: <CreditCardOutlined /> },
    { key: "bank", label: "Chuyển khoản", icon: <BankOutlined /> },
    { key: "momo", label: "Ví MoMo", icon: <MobileOutlined /> },
  ];

  const quickAmounts = [
    { value: totalAmount, label: "Đủ" },
    { value: Math.ceil(totalAmount / 10000) * 10000, label: "Làm tròn" },
    { value: 100000, label: "100,000đ" },
    { value: 200000, label: "200,000đ" },
    { value: 500000, label: "500,000đ" },
  ];

  const handleQuickAmount = (amount) => {
    setCashReceived(amount);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);

      const paymentDetails = {
        method: paymentMethod,
        amount: totalAmount,
        cashReceived: cashReceived,
        changeAmount: cashReceived - totalAmount,
        items: cart,
        timestamp: new Date(),
      };

      message.success("Thanh toán thành công!");
      onComplete(paymentDetails);
    }, 1000);
  };

  const changeAmount = cashReceived - totalAmount;

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "cash":
        return (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Row gutter={8} align="middle">
                      <Col span={8}>
                        <Text strong>Tổng tiền:</Text>
                      </Col>
                      <Col span={16}>
                        <Text strong style={{ fontSize: "18px", float: "right" }}>
                          {totalAmount.toLocaleString()}đ
                        </Text>
                      </Col>
                    </Row>

                    <Row gutter={8} align="middle">
                      <Col span={8}>
                        <Text strong>Khách trả:</Text>
                      </Col>
                      <Col span={16}>
                        <InputNumber
                          style={{ width: "100%" }}
                          size="large"
                          value={cashReceived}
                          onChange={setCashReceived}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          min={0}
                        />
                      </Col>
                    </Row>

                    <Row gutter={8} align="middle">
                      <Col span={8}>
                        <Text strong>Tiền thừa:</Text>
                      </Col>
                      <Col span={16}>
                        <Text
                          strong
                          style={{
                            fontSize: "18px",
                            float: "right",
                            color: changeAmount < 0 ? "#ff4d4f" : "#52c41a",
                          }}
                        >
                          {changeAmount.toLocaleString()}đ
                        </Text>
                      </Col>
                    </Row>
                  </Space>
                </Card>
              </Col>

              <Col span={24}>
                <Space wrap>
                  {quickAmounts.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => handleQuickAmount(option.value)}
                      size="large"
                    >
                      {option.label}
                    </Button>
                  ))}
                </Space>
              </Col>
            </Row>
          </Space>
        );

      case "card":
        return (
          <Form layout="vertical">
            <Form.Item label="Số thẻ" name="cardNumber" rules={[{ required: true }]}>
              <Input placeholder="Nhập số thẻ" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Ngày hết hạn" name="expiry" rules={[{ required: true }]}>
                  <Input placeholder="MM/YY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="CVV" name="cvv" rules={[{ required: true }]}>
                  <Input placeholder="CVV" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );

      case "bank":
        return (
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text>Chuyển khoản đến số tài khoản:</Text>
              <Title level={4}>1234 5678 9012</Title>
              <Text>Ngân hàng: BIDV</Text>
              <Text>Chủ tài khoản: CÔNG TY ABC</Text>
              <Text type="secondary">
                Nội dung: Thanh toán đơn hàng #{Math.floor(Math.random() * 10000)}
              </Text>
              <Divider />
              <Text>Vui lòng xác nhận sau khi khách hàng đã chuyển khoản thành công</Text>
            </Space>
          </Card>
        );

      case "momo":
        return (
          <Card>
            <Space direction="vertical" align="center" style={{ width: "100%" }}>
              <img
                src="https://via.placeholder.com/200x200?text=QR+Code"
                alt="QR code"
                style={{ width: "200px", height: "200px" }}
              />
              <Text>Số tiền: {totalAmount.toLocaleString()}đ</Text>
              <Text type="secondary">Quét mã QR để thanh toán qua ví MoMo</Text>
            </Space>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={<Title level={4}>Thanh toán</Title>}
      open={visible}
      onCancel={onCancel}
      width={700}
      centered
      maskClosable={false}
      footer={[
        <Button key="back" onClick={onCancel} icon={<CloseCircleOutlined />}>
          Hủy
        </Button>,
        <Button key="print" type="default" icon={<PrinterOutlined />}>
          In trước
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isProcessing}
          onClick={handleCompletePayment}
          disabled={paymentMethod === "cash" && changeAmount < 0}
          icon={<CheckCircleFilled />}
        >
          Hoàn tất
        </Button>,
      ]}
    >
      <Row gutter={[24, 16]}>
        <Col span={8}>
          <Card title="Chi tiết đơn hàng" size="small" className="overflow-y-auto h-dvh">
            <List
              size="small"
              dataSource={cart}
              renderItem={(item) => (
                <List.Item>
                  <Space style={{ width: "100%" }} direction="vertical" size={0}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Text>{item.name}</Text>
                      <Text strong>{(item.price * item.quantity).toLocaleString()}đ</Text>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Text type="secondary">
                        {item.quantity} x {item.price.toLocaleString()}đ
                      </Text>
                    </div>
                  </Space>
                </List.Item>
              )}
              footer={
                <Space direction="vertical" style={{ width: "100%" }} size={2}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text>Tổng tiền</Text>
                    <Text strong>{totalAmount.toLocaleString()}đ</Text>
                  </div>
                </Space>
              }
              style={{ height: "100%", overflow: "auto" }}
            />
          </Card>
        </Col>

        <Col span={16}>
          <Card>
            <Space style={{ width: "100%" }} direction="vertical" size="large">
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                buttonStyle="solid"
                style={{ width: "100%" }}
              >
                <Row gutter={[16, 16]}>
                  {paymentOptions.map((option) => (
                    <Col span={12} key={option.key}>
                      <Radio.Button
                        value={option.key}
                        style={{
                          width: "100%",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Space>
                          {option.icon}
                          {option.label}
                        </Space>
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>

              <Divider />

              {renderPaymentForm()}
            </Space>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default PaymentModal;
