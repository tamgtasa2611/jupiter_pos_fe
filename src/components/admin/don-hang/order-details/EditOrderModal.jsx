import React, { useState, useEffect } from "react";
import { Modal, Tabs, Spin, message, Flex, Button } from "antd";
import { getOrderById, updateOrderStatus } from "@/requests/order";
import {
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  PAYMENT_METHOD_MAP,
} from "@constants/order";
import CreatePaymentForm from "../CreatePaymentModal";
import { VALID_TRANSITIONS } from "@constants/order";
import OrderInfo from "./OrderInfo";
import ProductInfo from "./ProductInfo";
import PaymentInfo from "./PaymentInfo";
import HistoryInfo from "./HistoryInfo";

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

const EditOrderModal = ({ visible, onCancel, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [activeTab, setActiveTab] = useState("order");
  const reloadOrder = async () => {
    const updatedOrder = await getOrderById(orderId);
    setOrder(updatedOrder);
  };

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

  const handleCreatePayment = async () => {
    setShowPaymentForm(false);
    setLoading(true);
    const updatedOrder = await getOrderById(orderId);
    setOrder(updatedOrder);
    setLoading(false);
    setActiveTab("payment");
  };

  const handleUpdateOrderStatus = async (status) => {
    const payload = {
      oldOrderStatus: order?.orderStatus || null,
      newOrderStatus: status,
    };
    try {
      setLoading(true);
      const res = await updateOrderStatus(orderId, payload);

      message.success("Cập nhật trạng thái đơn hàng thành công");
      const updatedOrder = await getOrderById(orderId);
      setOrder(updatedOrder);
      setActiveTab("order");
    } catch (error) {
      message.error(error || "Cập nhật trạng thái đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    switch (activeTab) {
      case "payment":
        return (
          <Flex justify="flex-end" style={{ marginTop: 8 }}>
            <Button type="primary" onClick={() => setShowPaymentForm(true)}>
              Thêm thanh toán
            </Button>
          </Flex>
        );
      case "order":
        const orderStatus = order?.orderStatus;
        if (orderStatus !== null && orderStatus !== undefined) {
          const validTransitions = VALID_TRANSITIONS.get(orderStatus) || [];
          if (validTransitions.size > 0) {
            return (
              <Flex justify="space-between" style={{ marginTop: 8 }} gap={8}>
                {Array.from(validTransitions).map((status) => (
                  <Button
                    key={status}
                    danger={ORDER_STATUS_MAP[status]?.danger || false}
                    type="primary"
                    onClick={() => {
                      Modal.confirm({
                        title: `Xác nhận cập nhật trạng thái`,
                        content: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng sang "${ORDER_STATUS_MAP[status].label}"?`,
                        onOk: () => handleUpdateOrderStatus(status),
                        onCancel: () => {},
                      });
                    }}
                  >
                    {ORDER_STATUS_MAP[status].label}
                  </Button>
                ))}
              </Flex>
            );
          }
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        title={`Cập nhật đơn hàng: ${order ? order.id : ""}`}
        open={visible}
        maskClosable={false}
        onCancel={() => {
          setOrder(null);
          setActiveTab("order");
          onCancel();
        }}
        footer={renderFooter()}
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
                children: <OrderInfo order={order} /> || "Không có dữ liệu",
              },
              {
                key: "product",
                label: "Thông tin sản phẩm",
                children:
                  order.orderDetails && order.orderDetails.length > 0 ? (
                    <ProductInfo order={order} />
                  ) : (
                    "Không có dữ liệu sản phẩm"
                  ),
              },
              {
                key: "payment",
                label: "Thông tin thanh toán",
                children:
                  order.payments && order.payments.length > 0 ? (
                    <PaymentInfo
                      order={order}
                      paymentMethodOptions={paymentMethodOptions}
                      reloadOrder={reloadOrder}
                    />
                  ) : (
                    "Không có dữ liệu thanh toán"
                  ),
              },
              {
                key: "history",
                label: "Lịch sử đơn hàng",
                children:
                  order.orderHistories && order.orderHistories.length > 0 ? (
                    <HistoryInfo order={order} />
                  ) : (
                    "Không có lịch sử đơn hàng"
                  ),
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
        <CreatePaymentForm
          order={order}
          paymentMethodOptions={paymentMethodOptions}
          paymentStatusOptions={paymentStatusOptions}
          onSuccess={handleCreatePayment}
          onCancel={() => setShowPaymentForm(false)}
        />
      </Modal>
    </>
  );
};

export default React.memo(EditOrderModal);
