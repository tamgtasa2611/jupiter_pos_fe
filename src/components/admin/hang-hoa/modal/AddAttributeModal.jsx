import { Modal, Form, Input } from "antd";

const AddAttributeModal = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values); // gửi dữ liệu về component cha
      form.resetFields();
    } catch (error) {
      console.error("Validation error:", error);
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
      zIndex={1151} // Đảm bảo modal hiển thị trên các modal khác
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
