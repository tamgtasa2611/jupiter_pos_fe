import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";

const EditCustomerModal = ({ visible, onCancel, onEdit, customer }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (customer) {
      form.setFieldsValue({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      });
    }
  }, [customer, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      onEdit({ ...customer, ...values });
    });
  };

  return (
    <Modal title="Sửa khách hàng" visible={visible} onOk={handleOk} onCancel={onCancel}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên khách hàng"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Email không hợp lệ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCustomerModal;
