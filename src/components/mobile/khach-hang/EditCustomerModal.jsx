import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Switch, App, Spin } from "antd";
import { getCustomerById, updateCustomer } from "@/requests/customer";

const EditCustomerModal = ({ visible, onCancel, onEdit, customerId }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [oldValues, setOldValues] = useState({});

  useEffect(() => {
    if (visible && customerId) {
      setLoading(true);
      getCustomerById(customerId)
        .then((res) => {
          form.setFieldsValue({
            customerName: res.customerName,
            phone: res.phone,
            gender: res.gender,
            address: res.address,
          });
          setOldValues({
            customerName: res.customerName,
            phone: res.phone,
            gender: res.gender,
            address: res.address,
          });
        })
        .catch((error) => {
          message.error("Lỗi khi tải thông tin khách hàng");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, customerId, form]);

  const handleFinish = async (values) => {
    try {
      // Kiểm tra nếu không có thay đổi gì thì không cần cập nhật
      if (JSON.stringify(oldValues) !== JSON.stringify(values)) {
        const res = await updateCustomer(customerId, values);
        if (onEdit) onEdit(res.data);
      }
      message.success("Cập nhật khách hàng thành công");
      form.resetFields();

      onCancel();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật khách hàng",
      );
      console.error(error);
    }
  };

  return (
    <Modal
      title="Sửa thông tin khách hàng"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      centered
      width={600}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Spin />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng!" },
            ]}
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
            <Switch checkedChildren="Nam" unCheckedChildren="Nữ" />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cập nhật khách hàng
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditCustomerModal;
