import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Switch, Button, App } from "antd";
import { updateCustomer } from "@requests/customer";

const EditCustomerModal = ({ visible, onCancel, onCreated, customer }) => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && customer) {
      form.setFieldsValue({
        phone: customer.phone,
        customerName: customer.customerName,
        gender: customer.gender,
        address: customer.address,
      });
    }
  }, [visible, customer, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        customerName: values.customerName,
        gender: values.gender || true,
        address: values.address,
        phone: values.phone,
      };
      const res = await updateCustomer(customer.id, payload);
      console.log(res);

      if (res && !res?.data?.message) {
        message.success("Cập nhật khách hàng thành công");
        form.resetFields();
        onCreated();
        onCancel();
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật khách hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa khách hàng"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
      zIndex={1001}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          name="customerName"
          label="Tên khách hàng"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>
        <Form.Item name="gender" label="Giới tính" valuePropName="checked">
          <Switch checkedChildren="Nam" unCheckedChildren="Nữ" defaultChecked />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo khách hàng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCustomerModal;
