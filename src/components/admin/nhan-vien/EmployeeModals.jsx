import React from "react";
import { Modal, Form, Input, Row, Col, Select, DatePicker, Space, Button } from "antd";

const { Option } = Select;

const AddEmployeeModal = ({ addModalVisible, setAddModalVisible, handleAddEmployee, form }) => {
  return (
    <Modal
      title="Thêm nhân viên mới"
      open={addModalVisible}
      onCancel={() => setAddModalVisible(false)}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleAddEmployee}>
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="code"
          label="Mã nhân viên"
          rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
        >
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="position"
              label="Vị trí"
              rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
            >
              <Select placeholder="Chọn vị trí">
                <Option value="Quản lý">Quản lý</Option>
                <Option value="Nhân viên bán hàng">Nhân viên bán hàng</Option>
                <Option value="Nhân viên kho">Nhân viên kho</Option>
                <Option value="Kế toán">Kế toán</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Phòng ban"
              rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
            >
              <Select placeholder="Chọn phòng ban">
                <Option value="Ban quản lý">Ban quản lý</Option>
                <Option value="Kinh doanh">Kinh doanh</Option>
                <Option value="Kho vận">Kho vận</Option>
                <Option value="Tài chính">Tài chính</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="joinDate"
          label="Ngày vào làm"
          rules={[{ required: true, message: "Vui lòng chọn ngày vào làm!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Space style={{ float: "right" }}>
            <Button onClick={() => setAddModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const EditEmployeeModal = ({
  editModalVisible,
  setEditModalVisible,
  handleEditEmployee,
  form,
  selectedEmployee,
}) => {
  return (
    <Modal
      title="Chỉnh sửa thông tin nhân viên"
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleEditEmployee}>
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="code"
          label="Mã nhân viên"
          rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
        >
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="position"
              label="Vị trí"
              rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
            >
              <Select placeholder="Chọn vị trí">
                <Option value="Quản lý">Quản lý</Option>
                <Option value="Nhân viên bán hàng">Nhân viên bán hàng</Option>
                <Option value="Nhân viên kho">Nhân viên kho</Option>
                <Option value="Kế toán">Kế toán</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Phòng ban"
              rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
            >
              <Select placeholder="Chọn phòng ban">
                <Option value="Ban quản lý">Ban quản lý</Option>
                <Option value="Kinh doanh">Kinh doanh</Option>
                <Option value="Kho vận">Kho vận</Option>
                <Option value="Tài chính">Tài chính</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="joinDate"
          label="Ngày vào làm"
          rules={[{ required: true, message: "Vui lòng chọn ngày vào làm!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          initialValue={selectedEmployee?.status}
        >
          <Select>
            <Option value="active">Đang làm việc</Option>
            <Option value="inactive">Đã nghỉ việc</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space style={{ float: "right" }}>
            <Button onClick={() => setEditModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const DeleteEmployeeModal = ({
  deleteModalVisible,
  setDeleteModalVisible,
  handleDeleteEmployee,
  selectedEmployee,
}) => {
  return (
    <Modal
      title="Xác nhận xóa"
      open={deleteModalVisible}
      onCancel={() => setDeleteModalVisible(false)}
      onOk={handleDeleteEmployee}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa nhân viên {selectedEmployee?.name} không?</p>
      <p>Hành động này không thể hoàn tác.</p>
    </Modal>
  );
};

export { AddEmployeeModal, EditEmployeeModal, DeleteEmployeeModal };
