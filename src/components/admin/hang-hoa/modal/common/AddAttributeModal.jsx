import { Modal, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const AddAttributeModal = ({ visible, onCancel, onOk }) => {
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
      await onOk(values); // gọi hàm API từ component cha
      setLoading(false);
    } catch (error) {
      console.error("Validation error:", error);
      message.error("Lỗi khi thêm thuộc tính!");
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm thuộc tính mới"
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
      confirmLoading={loading} // hiển thị loading trên nút Thêm
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="attributeName"
          label="Tên thuộc tính"
          rules={[{ required: true, message: "Vui lòng nhập tên thuộc tính!" }]}
        >
          <Input placeholder="Nhập tên thuộc tính" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAttributeModal;
