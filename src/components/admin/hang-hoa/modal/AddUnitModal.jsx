import { Modal, Form, Input, message } from "antd";
import { useEffect, useState } from "react";

const AddUnitModal = ({ visible, onCancel, onOk }) => {
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
      message.error("Lỗi khi thêm đơn vị!");
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm đơn vị mới"
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
          name="unitName"
          label="Tên đơn vị"
          rules={[{ required: true, message: "Vui lòng nhập tên đơn vị!" }]}
        >
          <Input placeholder="Nhập tên đơn vị" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUnitModal;