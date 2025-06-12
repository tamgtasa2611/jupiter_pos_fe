import React, { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Descriptions,
  Spin,
  message,
  List,
  Image,
  Card,
  Tag,
  Flex,
  Typography,
  Button,
  Form,
} from "antd";
import dayjs from "dayjs";
import { getOrderById } from "@/requests/order";
import {
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  PAYMENT_METHOD_MAP,
} from "@constants/order";
import { FALLBACK_IMAGE } from "@constants/product";
import UpdatePaymentForm from "./UpdatePaymentModal";

const { Paragraph } = Typography;

const paymentMethodOptions = Object.entries(PAYMENT_METHOD_MAP).map(
  ([key, value]) => ({
    value: key,
    label: value.label,
  }),
);

const paymentStatusOptions = Object.entries(PAYMENT_STATUS_MAP).map(
  ([key, value]) => ({
    value: key,
    label: value.label,
  }),
);

const ViewOrderModal = ({ visible, onCancel, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [activeTab, setActiveTab] = useState("order");

  useEffect(() => {
    if (visible && orderId) {
      setLoading(true);
      getOrderById(orderId)
        .then((res) => {
          setOrder(res);
        })
        .catch((error) => {
          message.error("Lỗi khi tải chi tiết đơn hàng");
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }, [visible, orderId]);

  const renderGeneralInfo = () => (
    <Card>
      <Descriptions column={2} size="large">
        <Descriptions.Item label="Mã đơn hàng">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          {order.orderDate
            ? dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Người xử lý">
          {order?.user?.fullName || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tên khách hàng">
          {order.customer && order.customer.customerName
            ? order.customer.customerName
            : order.receiverName || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={ORDER_STATUS_MAP[order.orderStatus]?.color || "default"}>
            {ORDER_STATUS_MAP[order.orderStatus]
              ? ORDER_STATUS_MAP[order.orderStatus].label
              : order.orderStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {order.receiverPhone ||
            (order.customer && order.customer.phone) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {order.totalAmount != null
            ? new Intl.NumberFormat("vi-VN").format(order.totalAmount) + " đ"
            : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ nhận hàng">
          {order.receiverAddress ||
            (order.customer && order.customer.address) ||
            "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">
          <Paragraph ellipsis={{ rows: 2, tooltip: order.note }}>
            {order.note || "-"}
          </Paragraph>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );

  const renderProductInfo = () => (
    <div
      style={{
        maxHeight: "calc(100vh - 240px)",
        overflowY: "auto",
        borderRadius: 8,
      }}
    >
      <List
        itemLayout="vertical"
        dataSource={order.orderDetails}
        renderItem={(detail, index) => {
          const variant = detail.productVariant;
          const product = variant.product;
          return (
            <Card
              key={index}
              style={{
                marginBottom: 16,
                boxShadow: "0",
              }}
            >
              <Flex justify="flex-start" align="center" gap={16}>
                <Image
                  src={variant?.imagePaths?.[0] || FALLBACK_IMAGE}
                  alt={product.productName}
                  width={120}
                  height={120}
                  style={{
                    objectFit: "contain",
                    borderRadius: 8,
                    marginRight: 16,
                    overflow: "hidden",
                  }}
                />
                <Descriptions
                  title={`Sản phẩm ${index + 1}`}
                  column={1}
                  size="small"
                  style={{ flex: 1 }}
                >
                  <Descriptions.Item label="Tên sản phẩm">
                    {product.productName}
                  </Descriptions.Item>
                  <Descriptions.Item label="SKU">
                    {variant.sku || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá bán">
                    {detail.price != null
                      ? new Intl.NumberFormat("vi-VN").format(detail.price) +
                        " đ"
                      : "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số lượng bán">
                    {detail.soldQuantity}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thành tiền">
                    {detail.soldPrice != null
                      ? new Intl.NumberFormat("vi-VN").format(
                          detail.soldPrice,
                        ) + " đ"
                      : "-"}
                  </Descriptions.Item>
                  {variant.attrValues && variant.attrValues.length > 0 && (
                    <Descriptions.Item label="Thuộc tính">
                      {variant.attrValues.map((attr) => (
                        <Tag key={attr.attrId} style={{ marginBottom: 4 }}>
                          <strong>{attr.attrName}</strong>: {attr.attrValue}{" "}
                          {attr.unitName ? `(${attr.unitName})` : ""}
                        </Tag>
                      ))}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Flex>
            </Card>
          );
        }}
      />
    </div>
  );

  const renderPaymentInfo = () => (
    <div
      style={{
        maxHeight: "calc(100vh - 240px)",
        overflowY: "auto",
        borderRadius: 8,
      }}
    >
      <List
        itemLayout="vertical"
        dataSource={order.payments}
        renderItem={(payment, index) => (
          <Card
            key={index}
            style={{
              marginBottom: 16,
            }}
          >
            <Descriptions
              title={`Thanh toán ${index + 1}`}
              column={2}
              size="small"
            >
              <Descriptions.Item label="Phương thức thanh toán">
                {
                  <Tag color={PAYMENT_METHOD_MAP[payment.paymentMethod]?.color}>
                    {PAYMENT_METHOD_MAP[payment.paymentMethod]?.label}
                  </Tag>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {
                  <Tag color={PAYMENT_STATUS_MAP[payment.status]?.color}>
                    {PAYMENT_STATUS_MAP[payment.status]?.label}
                  </Tag>
                }
              </Descriptions.Item>
              <Descriptions.Item label="Đã thanh toán">
                {payment.paid != null
                  ? new Intl.NumberFormat("vi-VN").format(payment.paid) + " đ"
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  payment.remaining != null && payment.remaining >= 0
                    ? "Còn nợ"
                    : "Tiền thừa"
                }
              >
                {/*
                remaining >= 0thì là còn nợ
                remaining < 0 thì là tiền thừa
                 */}
                {payment.remaining != null
                  ? new Intl.NumberFormat("vi-VN").format(
                      Math.abs(payment.remaining),
                    ) + " đ"
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thanh toán">
                {payment.date
                  ? dayjs(payment.date).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      />
    </div>
  );

  const renderHistoryInfo = () => {
    <List
      itemLayout="vertical"
      dataSource={order.history}
      renderItem={(item, index) => (
        <Card key={index} style={{ marginBottom: 16 }}>
          <Descriptions title={`Lịch sử ${index + 1}`} column={2} size="small">
            <Descriptions.Item label="Thời gian">
              {item.time ? dayjs(item.time).format("DD/MM/YYYY HH:mm") : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Hành động">
              {item.action || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    />;
  };

  const handleUpdatePayment = async () => {
    setShowPaymentForm(false);
    setLoading(true);
    const updatedOrder = await getOrderById(orderId);
    setOrder(updatedOrder);
    setLoading(false);
    setActiveTab("payment");
  };

  return (
    <>
      <Modal
        title={`Chi tiết đơn hàng: ${order ? order.id : ""}`}
        open={visible}
        maskClosable={false}
        onCancel={onCancel}
        footer={
          activeTab == "payment" ? (
            <Flex justify="flex-end" style={{ marginTop: 8 }}>
              <Button type="primary" onClick={() => setShowPaymentForm(true)}>
                Thêm thanh toán
              </Button>
            </Flex>
          ) : null
        }
        centered={true}
        width={800}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : order ? (
          <Tabs
            defaultActiveKey={activeTab}
            tabBarStyle={{
              backgroundColor: "#fff",
              borderRadius: 8,
              marginBottom: 16,
            }}
            onChange={(key) => setActiveTab(key)}
            items={[
              {
                key: "order",
                label: "Thông tin chung",
                children: renderGeneralInfo(),
              },
              {
                key: "product",
                label: "Thông tin sản phẩm",
                children:
                  order.orderDetails && order.orderDetails.length > 0
                    ? renderProductInfo()
                    : "Không có dữ liệu sản phẩm",
              },
              {
                key: "payment",
                label: "Thông tin thanh toán",
                children:
                  order.payments && order.payments.length > 0
                    ? renderPaymentInfo()
                    : "Không có dữ liệu thanh toán",
              },
              {
                key: "history",
                label: "Lịch sử đơn hàng",
                children:
                  order.history && order.history.length > 0
                    ? renderHistoryInfo()
                    : "Không có dữ liệu lịch sử",
              },
            ]}
          />
        ) : (
          <div style={{ textAlign: "center", padding: 60 }}>
            Không có dữ liệu
          </div>
        )}
      </Modal>
      <Modal
        open={showPaymentForm}
        onCancel={() => setShowPaymentForm(false)}
        footer={null}
        centered
        title="Thêm thanh toán cho đơn hàng"
        maskClosable={false}
        width={480}
      >
        <UpdatePaymentForm
          order={order}
          paymentMethodOptions={paymentMethodOptions}
          paymentStatusOptions={paymentStatusOptions}
          onSuccess={handleUpdatePayment}
          onCancel={() => setShowPaymentForm(false)}
        />
      </Modal>
    </>
  );
};

export default React.memo(ViewOrderModal);
