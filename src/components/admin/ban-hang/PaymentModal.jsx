import React, { useState, memo, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Card,
  Typography,
  Spin,
  Space,
  InputNumber,
  Radio,
  message,
  Flex,
  Image,
} from "antd";
import {
  MobileOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { PAYMENT_METHOD } from "@constants/order";
import TextArea from "antd/es/input/TextArea";
import { getQRCode } from "../../../requests/payment";
import { ORDER_TYPE, ORDER_TYPE_MAP } from "@constants/order";
import Draggable from "react-draggable";

const { Title, Text } = Typography;

const PaymentModal = memo(
  ({ visible, onCancel, onCheckout, totalAmount, cartSummary }) => {
    const [form] = Form.useForm();
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.TIEN_MAT);
    const [orderType, setOrderType] = useState(ORDER_TYPE.MUA_TRUC_TIEP);
    const [received, setReceived] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [qrLoading, setQrLoading] = useState(false);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [bounds, setBounds] = useState({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    });
    const draggleRef = useRef(null);

    useEffect(() => {
      form.setFieldsValue({ paid: received });
    }, [paymentMethod, received, form]);

    const handleGetQR = async () => {
      setQrLoading(true);
      try {
        const res = await getQRCode(received);
        setQrCodeUrl(res?.qrUrl || "");
        console.log("QR Code URL:", res?.qrUrl);
        setQrModalVisible(true);
      } catch {
        setQrCodeUrl("");
        message.error("Không lấy được mã QR");
      } finally {
        setQrLoading(false);
      }
    };

    const validateReceivedAmount = () => {
      return new Promise((resolve) => {
        if (received < 0) {
          message.error("Số tiền nhận không hợp lệ");
          return resolve(false);
        }
        if (received > totalAmount) {
          Modal.confirm({
            title: "Xác nhận số tiền khách trả vượt mức",
            content: `Số tiền khách trả (${received.toLocaleString()}đ) VƯỢT QUÁ số tiền cần thanh toán (${totalAmount.toLocaleString()}đ). Bạn có chắc chắn muốn tiếp tục?`,
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        } else if (received < totalAmount) {
          Modal.confirm({
            title: "Xác nhận số tiền khách trả không đủ",
            content: `Số tiền khách trả (${received.toLocaleString()}đ) KHÔNG ĐỦ số tiền cần thanh toán (${totalAmount.toLocaleString()}đ). Bạn có chắc chắn muốn tiếp tục?`,
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        } else {
          resolve(true);
        }
      });
    };

    const handleGenerateQRCode = async () => {
      const valid = await validateReceivedAmount();
      if (!valid) return;
      handleGetQR();
    };

    const handleFinish = async (values) => {
      const valid = await validateReceivedAmount();
      if (!valid) {
        return;
      } else {
        setIsProcessing(true);
        if (paymentMethod === PAYMENT_METHOD.BANKING) {
          if (!qrCodeUrl) {
            message.error("Vui lòng tạo mã QR trước khi thanh toán");
            setIsProcessing(false);

            return;
          } else {
            Modal.confirm({
              title: "Xác nhận thanh toán bằng mã QR",
              content: `Bạn có chắc chắn khách đã thanh toán (${totalAmount.toLocaleString()}đ)?`,
              onOk: () => {
                // Nếu xác nhận thành công thì mới tiến hành thanh toán
                console.log(values);
                onCheckout({
                  ...values,
                  paid: received,
                  paymentMethod: paymentMethod,
                  orderType: orderType,
                });
                form.resetFields();
                setIsProcessing(false);
              },
              onCancel: () => {},
            });
          }
        } else if (paymentMethod === PAYMENT_METHOD.TIEN_MAT) {
          console.log(values);
          onCheckout({
            ...values,
            paid: received,
            paymentMethod: paymentMethod,
            orderType: orderType,
          });
          form.resetFields();
          setIsProcessing(false);
        }
      }
    };

    const orderTypeOptions = [
      {
        key: ORDER_TYPE.MUA_TRUC_TIEP,
        label: ORDER_TYPE_MAP.MUA_TRUC_TIEP.label,
        icon: <DollarCircleOutlined />,
      },
      {
        key: ORDER_TYPE.MUA_ONLINE,
        label: ORDER_TYPE_MAP.MUA_ONLINE.label,
        icon: <CreditCardOutlined />,
      },
    ];

    const paymentOptions = [
      {
        key: PAYMENT_METHOD.TIEN_MAT,
        label: "Tiền mặt",
        icon: <DollarCircleOutlined />,
      },
      {
        key: PAYMENT_METHOD.BANKING,
        label: "Chuyển khoản",
        icon: <CreditCardOutlined />,
      },
    ];

    const quickAmounts = [
      { value: totalAmount, label: "Đủ" },
      { value: Math.round(totalAmount / 1000) * 1000, label: "Làm tròn" },
      { value: 5000, label: "5,000đ" },
      { value: 10000, label: "10,000đ" },
      { value: 20000, label: "20,000đ" },
      { value: 50000, label: "50,000đ" },
      { value: 100000, label: "100,000đ" },
      { value: 200000, label: "200,000đ" },
      { value: 500000, label: "500,000đ" },
      { value: 1000000, label: "1,000,000đ" },
    ];

    const handleQuickAmount = (amount) => {
      if (amount === null || amount === undefined) {
        setReceived(0);
        return;
      }
      if (amount !== received) {
        setReceived(amount);
        setQrCodeUrl(""); // Reset QR code
      }
    };

    const changeAmount = received - totalAmount;

    if (!visible) return null;

    const renderPaymentForm = () => {
      return (
        <div className="payment-details">
          <Flex justify="space-between" align="center" gap={16}>
            <Card
              className="payment-summary-card"
              style={{ background: "#f9f9f9", marginBottom: 16, flex: 1 }}
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
                  <Text type="secondary">
                    {paymentMethod === PAYMENT_METHOD.TIEN_MAT
                      ? "Khách trả:"
                      : "Khách chuyển:"}
                  </Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <InputNumber
                    style={{ width: "100%" }}
                    size="large"
                    value={received}
                    onChange={(value) => handleQuickAmount(value)}
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
                      color: received - totalAmount < 0 ? "#ff4d4f" : "#52c41a",
                    }}
                  >
                    {(received - totalAmount).toLocaleString()}đ
                  </Text>
                </Col>
              </Row>
            </Card>
            {/* QR cho BANKING */}
            {paymentMethod === PAYMENT_METHOD.BANKING && (
              <Button
                type="primary"
                loading={qrLoading}
                onClick={() => {
                  handleGenerateQRCode();
                }}
                disabled={received <= 0}
              >
                Tạo mã QR
              </Button>
            )}
          </Flex>

          {/* Quick amount: luôn hiển thị */}
          <Flex>
            <div className="w-full">
              <Text
                type="secondary"
                style={{ marginBottom: 8, display: "block" }}
              >
                Chọn nhanh:
              </Text>
              <Flex
                wrap
                gap={8}
                justify="space-between"
                align="center"
                style={{ margin: "0" }}
              >
                {quickAmounts.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => handleQuickAmount(option.value)}
                    style={{ minWidth: 100, flex: 1 }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Flex>
            </div>
          </Flex>
        </div>
      );
    };

    return (
      <>
        <Modal
          title={null}
          open={visible}
          onCancel={onCancel}
          centered
          width="90%"
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
                <Col span={16}>
                  <div style={{ padding: "0px" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <Text strong style={{ fontSize: "16px" }}>
                        Chọn phương thức thanh toán
                      </Text>
                    </div>
                    <Form.Item
                      name="paymentMethod"
                      initialValue={PAYMENT_METHOD.TIEN_MAT}
                      style={{ margin: 0 }}
                    >
                      <Radio.Group
                        onChange={(e) => {
                          const selectedValue = e.target.value;

                          setPaymentMethod(selectedValue);
                          form.setFieldsValue({ paymentMethod: selectedValue });
                        }}
                        initialValue={PAYMENT_METHOD.TIEN_MAT}
                        buttonStyle="solid"
                        size="large"
                        style={{ width: "100%" }}
                      >
                        <Row gutter={[12, 12]}>
                          {paymentOptions.map((option) => (
                            <Col span={12} key={option.key}>
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
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>

                <Col span={8}>
                  <div style={{ padding: "0px" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <Text strong style={{ fontSize: "16px" }}>
                        Chọn hình thức mua hàng
                      </Text>
                    </div>
                    <Form.Item
                      name="orderType"
                      initialValue={ORDER_TYPE.MUA_TRUC_TIEP}
                      style={{ margin: 0 }}
                    >
                      <Radio.Group
                        onChange={(e) => {
                          const selectedValue = e.target.value;

                          setOrderType(selectedValue);
                          form.setFieldsValue({ orderType: selectedValue });
                        }}
                        initialValue={ORDER_TYPE.MUA_TRUC_TIEP}
                        buttonStyle="solid"
                        size="large"
                        style={{ width: "100%" }}
                      >
                        <Row gutter={[12, 12]}>
                          {orderTypeOptions.map((option) => (
                            <Col span={12} key={option.key}>
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
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>

                <Col span={24}>{renderPaymentForm()}</Col>
              </Row>

              <Form.Item name="paid" hidden initialValue={received}>
                <Input />
              </Form.Item>
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

        {/* Draggable QR Code Modal */}
        <Modal
          zIndex={1001}
          maskClosable={false}
          open={qrModalVisible}
          centered
          title={
            <div style={{ width: "100%", cursor: "move" }}>
              QR Code Thanh Toán
            </div>
          }
          footer={null}
          onCancel={() => {
            setQrModalVisible(false);
          }}
          modalRender={(modal) => (
            <Draggable
              nodeRef={draggleRef}
              disabled={false}
              bounds={bounds}
              onStart={(event, uiData) => {
                const targetRect = draggleRef.current?.getBoundingClientRect();
                if (targetRect) {
                  const { clientWidth, clientHeight } =
                    document.documentElement;
                  setBounds({
                    left: -targetRect.left + uiData.x,
                    right: clientWidth - (targetRect.right - uiData.x),
                    top: -targetRect.top + uiData.y,
                    bottom: clientHeight - (targetRect.bottom - uiData.y),
                  });
                }
                return true;
              }}
            >
              <div ref={draggleRef}>{modal}</div>
            </Draggable>
          )}
        >
          <Flex
            vertical
            gap={8}
            align="center"
            justify="center"
            style={{ padding: "16px", cursor: "move" }}
          >
            <Text strong>Số tiền: {received.toLocaleString()}đ</Text>
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code"
                style={{ width: "480px", height: "500px" }}
              />
            ) : (
              <Spin />
            )}
          </Flex>
        </Modal>
      </>
    );
  },
);

PaymentModal.displayName = "PaymentModal";

export default PaymentModal;
