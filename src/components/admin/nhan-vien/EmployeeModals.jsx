import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Spin,
  Switch,
  Select,
  Flex,
} from "antd";
import { getEmployeeById } from "@/requests/employee";
const { Option } = Select;

export const AddEmployeeModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      // Gọi API tạo nhân viên với các trường: username, fullname, email, password, phone, gender, role, is_active
      await onAdd(values);
      message.success("Thêm nhân viên thành công");
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi thêm nhân viên");
    }
  };

  return (
    <Modal
      title="Thêm nhân viên mới"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      maskClosable={false}
      footer={null}
      centered
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Flex
          gap={8}
          justify="space-between"
          align="center"
          style={{ width: "100%" }}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
        </Flex>
        <Flex
          gap={8}
          justify="space-between"
          align="center"
          style={{ width: "100%" }}
        >
          <Form.Item
            name="phone"
            label="Số điện thoại"
            style={{ flex: 1 }}
            rules={[
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ (10 chữ số)!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            style={{ flex: 1 }}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </Flex>
        <Flex
          gap={8}
          justify="space-between"
          align="center"
          style={{ width: "100%" }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Flex gap={8} justify="space-between" align="center">
            <Form.Item name="gender" label="Giới tính" valuePropName="checked">
              <Switch
                checkedChildren="Nam"
                unCheckedChildren="Nữ"
                defaultChecked
              />
            </Form.Item>
            <Form.Item
              name="is_active"
              label="Trạng thái"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                checkedChildren="Hoạt động"
                unCheckedChildren="Ngưng hoạt động"
              />
            </Form.Item>
          </Flex>
        </Flex>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm nhân viên
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;

// Edit Employee Modal
export const EditEmployeeModal = ({
  visible,
  onCancel,
  onEdit,
  employeeId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && employeeId) {
      setLoading(true);
      getEmployeeById(employeeId)
        .then((res) => {
          const data = res.data;
          form.setFieldsValue({
            code: data.code,
            name: data.name,
            position: data.position,
            department: data.department,
            phone: data.phone,
            email: data.email,
            joinDate: data.joinDate,
          });
        })
        .catch((error) => {
          message.error("Lỗi khi tải thông tin nhân viên");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, employeeId, form]);

  const handleFinish = async (values) => {
    try {
      await onEdit(values);
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi cập nhật nhân viên");
    }
  };

  return (
    <Modal
      title="Sửa thông tin nhân viên"
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
            name="code"
            label="Mã NV"
            rules={[{ required: true, message: "Vui lòng nhập mã nhân viên!" }]}
          >
            <Input placeholder="Nhập mã nhân viên" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="position"
            label="Vị trí"
            rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}
          >
            <Input placeholder="Nhập vị trí" />
          </Form.Item>
          <Form.Item
            name="department"
            label="Phòng ban"
            rules={[{ required: true, message: "Vui lòng nhập phòng ban!" }]}
          >
            <Input placeholder="Nhập phòng ban" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="joinDate"
            label="Ngày vào làm"
            rules={[{ required: true, message: "Vui lòng nhập ngày vào làm!" }]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cập nhật nhân viên
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

// Delete Employee Modal
export const DeleteEmployeeModal = ({
  visible,
  onCancel,
  onDelete,
  employee,
}) => {
  return (
    <Modal
      title="Xác nhận xóa"
      open={visible}
      onCancel={onCancel}
      onOk={onDelete}
      okText="Xóa"
      cancelText="Hủy"
      centered
    >
      <p>
        Bạn có chắc chắn muốn xóa nhân viên <strong>{employee?.name}</strong>?
      </p>
    </Modal>
  );
};

// View Employee Modal
export const ViewEmployeeModal = ({ visible, onCancel, employeeId }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && employeeId) {
      setLoading(true);
      getEmployeeById(employeeId)
        .then((res) => {
          setEmployee(res.data);
        })
        .catch((error) => {
          message.error("Lỗi khi tải thông tin nhân viên");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, employeeId]);

  return (
    <Modal
      title="Xem chi tiết nhân viên"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={600}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Spin />
        </div>
      ) : employee ? (
        <div>
          <p>
            <strong>Mã NV:</strong> {employee.code}
          </p>
          <p>
            <strong>Họ và tên:</strong> {employee.name}
          </p>
          <p>
            <strong>Vị trí:</strong> {employee.position}
          </p>
          <p>
            <strong>Phòng ban:</strong> {employee.department}
          </p>
          <p>
            <strong>SĐT:</strong> {employee.phone}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Ngày vào làm:</strong>{" "}
            {new Intl.DateTimeFormat("vi-VN").format(
              new Date(employee.joinDate),
            )}
          </p>
        </div>
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </Modal>
  );
};
