import React from "react";
import { Modal, Form, Input, Button, message, Switch } from "antd";
import { createCustomer } from "@/requests/customer";

const AddCustomerModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      // Gọi API tạo customer với payload gồm: name, phone, email, address
      const response = await createCustomer(values);
      message.success("Thêm khách hàng thành công");
      form.resetFields();
      if (onAdd) onAdd(response.data);
      onCancel();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi thêm khách hàng");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Thêm khách hàng mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="customerName"
          label="Tên khách hàng"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Số điện thoại không hợp lệ (10 chữ số)!",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item name="gender" label="Giới tính" valuePropName="checked">
          <Switch checkedChildren="Nam" unCheckedChildren="Nữ" defaultChecked />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm khách hàng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
