import React, { useState, useEffect } from "react";
import { Modal, Tabs, Spin, App, Flex, Button } from "antd";
import { getOrderById, updateOrderStatus } from "@/requests/order";
import {
  ORDER_STATUS,
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
  const { message, modal } = App.useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [activeTab, setActiveTab] = useState("order");

  const totalPaid =
    order?.payments.reduce((sum, payment) => sum + (payment.paid || 0), 0) || 0;
  const lastPayment = order?.payments[order.payments.length - 1] || {};
  const remaining =
    lastPayment?.remaining || order?.totalAmount - totalPaid || 0;

  const isOrderEditable =
    order?.orderStatus !== ORDER_STATUS.HOAN_THANH &&
    order?.orderStatus !== ORDER_STATUS.DA_HUY;

  const isFullyEditable =
    order?.orderStatus === ORDER_STATUS.DON_NHAP ||
    order?.orderStatus === ORDER_STATUS.CHO_XAC_NHAN;

  const reloadOrder = async () => {
    const updatedOrder = await getOrderById(orderId);
    setOrder(updatedOrder);
  };

  useEffect(() => {
    if (visible && orderId) {
      setOrder(null);
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

  useEffect(() => {
    if (!visible) {
      setOrder(null);
      setActiveTab("order");
      setShowPaymentForm(false);
    }
  }, [visible]);

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
        const isPaymentEditable =
          order?.orderStatus !== ORDER_STATUS.HOAN_THANH &&
          order?.orderStatus !== ORDER_STATUS.DA_HUY;
        return (
          remaining > 0 &&
          isPaymentEditable && (
            <Flex justify="flex-end" style={{ marginTop: 8 }}>
              <Button type="primary" onClick={() => setShowPaymentForm(true)}>
                Thêm thanh toán
              </Button>
            </Flex>
          )
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
                      modal.confirm({
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
        width={840}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : order ? (
          <Tabs
            key={`tabs-${orderId}`}
            activeKey={activeTab}
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
                children:
                  (
                    <OrderInfo
                      order={order}
                      editable={isOrderEditable}
                      fullyEditable={isFullyEditable}
                      onOrderUpdate={reloadOrder}
                    />
                  ) || "Không có dữ liệu",
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
                      totalPaid={totalPaid}
                      remaining={remaining}
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
            {orderId ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
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
        destroyOnHidden
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
