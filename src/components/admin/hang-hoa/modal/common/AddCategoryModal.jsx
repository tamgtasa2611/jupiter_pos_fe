import { Modal, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const AddCategoryModal = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setLoading(false); // reset loading khi mở modal
    }
  }, [visible, form]);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onOk(values);
      setLoading(false);
    } catch (error) {
      console.error("Validation error:", error);
      message.error("Lỗi khi thêm danh mục!");
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm danh mục mới"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Thêm"
      cancelText="Hủy"
      width={400}
      zIndex={1151}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="categoryName"
          label="Tên danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
