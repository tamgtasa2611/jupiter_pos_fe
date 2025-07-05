import React, { useState } from "react";
import { Card, Descriptions, Select, Tag, List, App, Flex } from "antd";
import { PAYMENT_METHOD_MAP, PAYMENT_STATUS_MAP } from "@constants/order";
import dayjs from "dayjs";
import { updatePayment } from "@/requests/payment";

const PaymentInfo = ({
  order,
  paymentMethodOptions,
  reloadOrder,
  totalPaid,
  remaining,
}) => {
  const { message } = App.useApp();
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleChangeMethod = async (paymentId, newMethod) => {
    setUpdating(true);
    try {
      await updatePayment({ paymentId, paymentMethod: newMethod });
      if (reloadOrder) await reloadOrder();
      message.success("Cập nhật phương thức thanh toán thành công");
      setEditingPaymentId(null);
    } catch (e) {
      message.error("Cập nhật thất bại");
      setEditingPaymentId(null);
    } finally {
      setEditingPaymentId(null);
      setUpdating(false);
    }
  };

  return (
    <div
      style={{
        maxHeight: "calc(100vh - 240px)",
        overflowY: "auto",
        borderRadius: 8,
      }}
    >
      <Flex justify="space-between" align="center" style={{ padding: 16 }}>
        <div>
          Số tiền phải thanh toán:{" "}
          {new Intl.NumberFormat("vi-VN").format(order.totalAmount)} đ
        </div>
        <div>
          Tổng đã thanh toán: {new Intl.NumberFormat("vi-VN").format(totalPaid)}{" "}
          đ
        </div>
        <div>
          {remaining >= 0 ? `Còn nợ` : `Tiền thừa`}:{" "}
          {new Intl.NumberFormat("vi-VN").format(Math.abs(remaining))} đ
        </div>
      </Flex>
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
                {editingPaymentId === payment.id ? (
                  <Select
                    style={{ minWidth: 150 }}
                    loading={updating}
                    defaultValue={payment.paymentMethod}
                    options={paymentMethodOptions}
                    onChange={(value) => handleChangeMethod(payment.id, value)}
                    onBlur={() => setEditingPaymentId(null)}
                    autoFocus
                  />
                ) : (
                  <Tag
                    color={PAYMENT_METHOD_MAP[payment.paymentMethod]?.color}
                    style={{ cursor: "pointer" }}
                    onClick={() => setEditingPaymentId(payment.id)}
                  >
                    {PAYMENT_METHOD_MAP[payment.paymentMethod]?.label}
                  </Tag>
                )}
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
};

export default PaymentInfo;
