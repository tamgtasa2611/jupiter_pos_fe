import { Modal, Form, Input } from "antd";

const AddUnitModal = ({ visible, onCancel, onOk }) => {
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
      zIndex={1151} // Đảm bảo modal hiển thị trên các modal khác
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
