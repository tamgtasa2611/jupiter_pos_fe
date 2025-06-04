import React, { useState, memo, useEffect } from "react";
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
  Flex,
} from "antd";
import {
  MobileOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { ORDER_PAYMENT_METHOD } from "@constants/order";
import TextArea from "antd/es/input/TextArea";

const { Title, Text } = Typography;

// Tối ưu: chỉ truyền totalAmount và tổng số items thay vì toàn bộ giỏ hàng
const PaymentModal = memo(
  ({ visible, onCancel, onCheckout, totalAmount, cartSummary }) => {
    const [form] = Form.useForm();
    const [paymentMethod, setPaymentMethod] = useState(
      ORDER_PAYMENT_METHOD.TIEN_MAT,
    );
    const [cashReceived, setCashReceived] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Khởi tạo giá trị cashReceived khi totalAmount thay đổi
    useEffect(() => {
      setCashReceived(totalAmount);
    }, [totalAmount]);

    const handleFinish = (values) => {
      // Check if cash received (cashReceived state) is more than the total amount
      if (cashReceived > totalAmount) {
        Modal.confirm({
          title: "Xác nhận số tiền khách trả vượt mức",
          content: `Số tiền khách trả (${cashReceived.toLocaleString()}đ) VƯỢT QUÁ số tiền cần thanh toán (${totalAmount.toLocaleString()}đ). Bạn có chắc chắn muốn tiếp tục?`,
          onOk: () => {
            console.log(values);
            onCheckout(values);
            form.resetFields();
          },
          onCancel: () => {},
        });
      } else if (cashReceived < totalAmount) {
        Modal.confirm({
          title: "Xác nhận số tiền khách trả không đủ",
          content: `Số tiền khách trả (${cashReceived.toLocaleString()}đ) KHÔNG ĐỦ số tiền cần thanh toán (${totalAmount.toLocaleString()}đ). Bạn có chắc chắn muốn tiếp tục?`,
          onOk: () => {
            console.log(values);
            onCheckout(values);
            form.resetFields();
          },
          onCancel: () => {},
        });
      } else {
        console.log(values);
        onCheckout(values);
        form.resetFields();
      }
    };

    const paymentOptions = [
      {
        key: ORDER_PAYMENT_METHOD.TIEN_MAT,
        label: "Tiền mặt",
        icon: <DollarCircleOutlined />,
      },
      {
        key: ORDER_PAYMENT_METHOD.VNPAY,
        label: "Ví VNPay",
        icon: <CreditCardOutlined />,
      },
      {
        key: ORDER_PAYMENT_METHOD.MOMO,
        label: "Ví MoMo",
        icon: <MobileOutlined />,
      },
    ];

    const quickAmounts = [
      { value: totalAmount, label: "Đủ" },
      { value: Math.round(totalAmount / 1000) * 1000, label: "Làm tròn" },
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

    const changeAmount = cashReceived - totalAmount;

    // Chỉ render modal khi nó được mở
    if (!visible) return null;

    // Tách hẳn phần render form để giảm re-render
    const renderPaymentForm = () => {
      switch (paymentMethod) {
        case ORDER_PAYMENT_METHOD.TIEN_MAT:
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
              <Flex>
                <div className=" w-full">
                  <Text
                    type="secondary"
                    style={{ marginBottom: 8, display: "block" }}
                  >
                    Chọn nhanh:
                  </Text>
                  <Flex
                    wrap
                    gap={16}
                    justify="space-between"
                    align="center"
                    style={{ margin: "0" }}
                  >
                    {quickAmounts.map((option) => (
                      <Button
                        key={option.value}
                        onClick={() => handleQuickAmount(option.value)}
                        style={{ minWidth: 100 }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </Flex>
                </div>
              </Flex>
            </div>
          );

        case ORDER_PAYMENT_METHOD.VNPAY:
          return (
            <Card
              variant="borderless"
              style={{ background: "#f9f9f9", textAlign: "center" }}
            >
              <Flex
                gap={80}
                justify="center"
                align="center"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    margin: "0",
                    background: "white",
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src="https://via.placeholder.com/200x200?text=QR+Code"
                    alt="QR code"
                    style={{ width: "200px", height: "200px" }}
                  />
                </div>
                <Flex vertical align="center" gap={8}>
                  <Text strong style={{ fontSize: 20, marginTop: 12 }}>
                    {totalAmount.toLocaleString()}đ
                  </Text>
                  <Text type="secondary">
                    Quét mã để thanh toán qua ví VNPay
                  </Text>
                </Flex>
              </Flex>
            </Card>
          );

        case ORDER_PAYMENT_METHOD.MOMO:
          return (
            <Card
              variant="borderless"
              style={{ background: "#f9f9f9", textAlign: "center" }}
            >
              <Flex
                gap={80}
                justify="center"
                align="center"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    margin: "0",
                    background: "white",
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src="https://via.placeholder.com/200x200?text=QR+Code"
                    alt="QR code"
                    style={{ width: "200px", height: "200px" }}
                  />
                </div>
                <Flex vertical align="center" gap={8}>
                  <Text strong style={{ fontSize: 20, marginTop: 12 }}>
                    {totalAmount.toLocaleString()}đ
                  </Text>
                  <Text type="secondary">
                    Quét mã để thanh toán qua ví MoMo
                  </Text>
                </Flex>
              </Flex>
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
        centered
        width={1024}
        maskClosable={false}
        footer={null}
        styles={{
          body: { padding: "0" },
        }}
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ width: "100%", padding: "0", margin: "0" }}
        >
          <div style={{ padding: "24px" }}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div style={{ padding: "16px" }}>
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    buttonStyle="solid"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <Form.Item name="paymentMethod" style={{ margin: 0 }}>
                      <Row gutter={[12, 12]}>
                        {paymentOptions.map((option) => (
                          <Col span={8} key={option.key}>
                            <Radio.Button
                              value={option.key}
                              style={{
                                width: "100%",
                                height: "40px",
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
                    </Form.Item>
                  </Radio.Group>
                </div>
              </Col>

              <Col span={24}>{renderPaymentForm()}</Col>
            </Row>
          </div>

          <div style={{ width: "100%", padding: "0 24px" }}>
            <Form.Item
              name="note"
              label="Ghi chú"
              rules={[{ required: false }]}
              style={{ width: "100%" }}
            >
              <TextArea
                placeholder="Nhập ghi chú nếu có"
                style={{ width: "100%" }}
                rows={1}
              />
            </Form.Item>
          </div>

          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={onCancel} icon={<CloseCircleOutlined />}>
              Hủy
            </Button>

            <Space>
              {/* <Button icon={<PrinterOutlined />}>In trước</Button> */}
              <Button
                type="primary"
                loading={isProcessing}
                onClick={() => {
                  form.submit();
                }}
                disabled={paymentMethod === "cash" && changeAmount < 0}
                icon={<CheckCircleFilled />}
              >
                Hoàn tất
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    );
  },
);

PaymentModal.displayName = "PaymentModal";

export default PaymentModal;
