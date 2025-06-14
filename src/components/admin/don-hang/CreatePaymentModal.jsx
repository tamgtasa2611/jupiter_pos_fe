"use client";

import React, { useState } from "react";
import {
  Form,
  InputNumber,
  Select,
  Button,
  Flex,
  Tag,
  message as antdMessage,
} from "antd";
import { createPayment } from "@/requests/payment";
import { PAYMENT_METHOD } from "@/constants/order";

const CreatePaymentModal = ({
  order,
  paymentMethodOptions,
  onSuccess,
  onCancel,
}) => {
  const [paying, setPaying] = useState(false);
  const [messageApi, contextHolder] = antdMessage.useMessage();

  const handleFinish = async (values) => {
    setPaying(true);
    try {
      const payload = {
        orderId: order.id,
        paid: values.paid,
        paymentMethod: values.paymentMethod,
      };
      await createPayment(payload);
      messageApi.success("Cập nhật thanh toán thành công");
      if (onSuccess) onSuccess();
      else if (onCancel) onCancel();
    } catch (error) {
      messageApi.error(
        error?.response?.data?.message || "Cập nhật thanh toán thất bại",
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        layout="vertical"
        initialValues={{
          paid: order?.totalAmount || 0,
          paymentMethod: PAYMENT_METHOD.TIEN_MAT,
        }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="paid"
          label="Số tiền thanh toán"
          rules={[{ required: true, message: "Nhập số tiền thanh toán" }]}
        >
          <InputNumber
            min={0}
            max={order?.totalAmount}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/,/g, "")}
          />
        </Form.Item>
        <Form.Item
          name="paymentMethod"
          label="Phương thức thanh toán"
          rules={[{ required: true, message: "Chọn phương thức thanh toán" }]}
        >
          <Select
            options={paymentMethodOptions}
            // Nếu paymentMethodOptions là [{value, label}]
          />
        </Form.Item>
        <Form.Item>
          <Flex align="center" gap={8}>
            <span style={{ fontWeight: 500 }}>Trạng thái:</span>
            <Tag color="green" style={{ fontSize: 14, marginLeft: 4 }}>
              Thanh toán thành công
            </Tag>
          </Flex>
        </Form.Item>
        <Flex justify="flex-end" gap={8}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={paying}>
            Xác nhận
          </Button>
        </Flex>
      </Form>
    </>
  );
};

export default CreatePaymentModal;
