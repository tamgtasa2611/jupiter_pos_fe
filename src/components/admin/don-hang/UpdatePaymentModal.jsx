"use client";

import React, { useState } from "react";
import { Form, InputNumber, Select, Button, Flex, message as antdMessage } from "antd";
import { UpdatePayment } from "@/requests/payment";

const { Option } = Select;

const UpdatePaymentForm = ({
  order,
  paymentMethodOptions,
  paymentStatusOptions,
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
        paymentStatus: values.paymentStatus,
      };
      await UpdatePayment(payload);
      messageApi.success("Cập nhật thanh toán thành công");
      if (onSuccess) onSuccess();
      if (onCancel) onCancel();
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
          paymentMethod: "TIEN_MAT",
          paymentStatus: "CHUA_THANH_TOAN",
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
          <Select>
            {paymentMethodOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="paymentStatus"
          label="Trạng thái thanh toán"
          rules={[{ required: true, message: "Chọn trạng thái thanh toán" }]}
        >
          <Select>
            {paymentStatusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
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

export default UpdatePaymentForm;