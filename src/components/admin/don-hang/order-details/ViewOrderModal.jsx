import React, { useState, useEffect } from "react";
import { Modal, Tabs, Spin, App, Button } from "antd";
import { getOrderById } from "@/requests/order";
import { PAYMENT_METHOD_MAP } from "@constants/order";
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

const ViewOrderModal = ({ visible, onCancel, orderId, onEdit }) => {
  const { message } = App.useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <>
      <Modal
        title={`Chi tiết đơn hàng: ${order ? order.id : ""}`}
        open={visible}
        onCancel={() => {
          setOrder(null);
          setActiveTab("order");
          onCancel();
        }}
        footer={
          <Button type="primary" onClick={onEdit}>
            Chỉnh sửa
          </Button>
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
    </>
  );
};

export default React.memo(ViewOrderModal);
