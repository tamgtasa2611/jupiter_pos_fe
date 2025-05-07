import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Space,
  InputNumber,
  Radio,
  message,
  Badge,
  Flex,
} from "antd";
import {
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
    { key: "bank", label: "Chuyển khoản", icon: <BankOutlined /> },
    { key: "momo", label: "Ví MoMo", icon: <MobileOutlined /> },
  ];

  const quickAmounts = [
    { value: totalAmount, label: "Đủ" },
    { value: Math.ceil(totalAmount / 10000) * 10000, label: "Làm tròn" },
    { value: 10000, label: "10,000đ" },
    { value: 20000, label: "20,000đ" },
    { value: 50000, label: "50,000đ" },
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
          <div className="payment-details">
            <Card
              className="payment-summary-card"
              bordered={false}
              style={{ background: "#f9f9f9", marginBottom: 16 }}
            >
              <Row gutter={[16, 20]} align="middle">
                <Col span={12}>
                  <Text type="secondary">Tổng tiền:</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text strong style={{ fontSize: "16px" }}>
                    {totalAmount.toLocaleString()}đ
                  </Text>
                </Col>

                <Col span={12}>
                  <Text type="secondary">Khách trả:</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <InputNumber
                    style={{ width: "100%" }}
                    size="large"
                    value={cashReceived}
                    onChange={setCashReceived}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    min={0}
                  />
                </Col>

                <Col span={12}>
                  <Text type="secondary">Tiền thừa:</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text
                    strong
                    style={{
                      fontSize: "18px",
                      color: changeAmount < 0 ? "#ff4d4f" : "#52c41a",
                    }}
                  >
                    {changeAmount.toLocaleString()}đ
                  </Text>
                </Col>
              </Row>
            </Card>
            <div className="quick-amount-buttons">
              <Text
                type="secondary"
                style={{ marginBottom: 8, display: "block" }}
              >
                Chọn nhanh:
              </Text>
              <Space wrap style={{ justifyContent: "flex-start" }}>
                {quickAmounts.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => handleQuickAmount(option.value)}
                    style={{ minWidth: 100 }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        );

      case "card":
        return (
          <Form layout="vertical">
            <Form.Item
              label="Số thẻ"
              name="cardNumber"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập số thẻ" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày hết hạn"
                  name="expiry"
                  rules={[{ required: true }]}
                >
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
          <div className="bank-transfer-info">
            <Card bordered={false} style={{ background: "#f9f9f9" }}>
              <Space
                direction="vertical"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Badge.Ribbon text="Chuyển khoản" color="blue">
                  <div style={{ padding: "8px 0" }}>
                    <Title level={4}>1234 5678 9012</Title>
                    <div>
                      <Text strong>Ngân hàng: BIDV</Text>
                    </div>
                    <div>
                      <Text strong>Chủ TK: CÔNG TY ABC</Text>
                    </div>
                    <Divider style={{ margin: "12px 0" }} />
                    <div>
                      <Text type="secondary">Nội dung chuyển khoản:</Text>
                      <div
                        style={{
                          margin: "8px 0",
                          background: "#e6f7ff",
                          padding: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        <Text copyable strong>
                          Thanh toán #{Math.floor(Math.random() * 10000)}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Badge.Ribbon>
              </Space>
            </Card>
          </div>
        );

      case "momo":
        return (
          <Card
            bordered={false}
            style={{ background: "#f9f9f9", textAlign: "center" }}
          >
            <Space
              direction="vertical"
              align="center"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  width: 200,
                  height: 200,
                  margin: "0 auto",
                  background: "white",
                  padding: 16,
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src="https://via.placeholder.com/200x200?text=QR+Code"
                  alt="QR code"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <Text strong style={{ fontSize: 16, marginTop: 12 }}>
                {totalAmount.toLocaleString()}đ
              </Text>
              <Text type="secondary">Quét mã để thanh toán qua ví MoMo</Text>
            </Space>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      width={800}
      centered
      maskClosable={false}
      footer={null}
      styles={{}}
      className="payment-modal"
    >
      <div
        style={{
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Thanh toán
        </Title>
        <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
          {totalAmount.toLocaleString()}đ
        </Text>
      </div>

      <div style={{ padding: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div styles={{ padding: "16px" }}>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                buttonStyle="solid"
                size="large"
                style={{ width: "100%" }}
              >
                <Row gutter={[12, 12]}>
                  {paymentOptions.map((option) => (
                    <Col span={6} key={option.key}>
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
                        <Flex align="center" justify="center" gap={8}>
                          {option.icon}
                          {option.label}
                        </Flex>
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>
            </div>
          </Col>

          <Col span={24}>{renderPaymentForm()}</Col>
        </Row>
      </div>

      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "16px 24px",
          // background: "#fafafa",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onCancel} icon={<CloseCircleOutlined />}>
          Hủy
        </Button>

        <Space>
          <Button icon={<PrinterOutlined />}>In trước</Button>
          <Button
            type="primary"
            loading={isProcessing}
            onClick={handleCompletePayment}
            disabled={paymentMethod === "cash" && changeAmount < 0}
            icon={<CheckCircleFilled />}
          >
            Hoàn tất
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PaymentModal;
