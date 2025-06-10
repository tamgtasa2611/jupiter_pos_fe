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
  Descriptions,
} from "antd";
import { getEmployeeById } from "@/requests/employee";
const { Option } = Select;

export const AddEmployeeModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      // Gọi API tạo nhân viên với các trường: username, fullname, email, password, phone, gender, role, is_active
      const res = await onAdd(values);

      if (res.response?.data?.error) {
        return;
      } else {
        form.resetFields();
      }
    } catch (error) {}
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
          <Form.Item name="fullname" label="Họ và tên" style={{ flex: 1 }}>
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
              name="active"
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
          form.setFieldsValue({
            username: res.username,
            fullname: res.fullname,
            phone: res.phone,
            email: res.email,
            gender: res.gender, // boolean: true (Nam), false (Nữ)
            active: res.active,
            // Không map password để bảo mật, nếu muốn cập nhật mật khẩu thì người dùng nhập mới.
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
      const res = await onEdit(values);
      console.log(res.response?.data?.error);

      if (res.response?.data?.error) {
        return;
      } else {
        form.resetFields();
      }
    } catch (error) {}
  };

  return (
    <Modal
      title="Sửa thông tin nhân viên"
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
      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Spin />
        </div>
      ) : (
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
            <Form.Item name="fullname" label="Họ và tên" style={{ flex: 1 }}>
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
              name="email"
              label="Email"
              rules={[{ type: "email", message: "Email không hợp lệ!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Flex>
          <Flex
            gap={8}
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
          >
            <Flex gap={8} justify="space-between" align="center">
              <Form.Item
                name="gender"
                label="Giới tính"
                valuePropName="checked"
              >
                <Switch checkedChildren="Nam" unCheckedChildren="Nữ" />
              </Form.Item>
              <Form.Item
                name="active"
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
          setEmployee(res);
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
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{employee.id}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">
            {employee.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Tên đăng nhập">
            {employee.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {employee.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {employee.gender ? "Nam" : "Nữ"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {employee.active ? "Hoạt động" : "Ngưng hoạt động"}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </Modal>
  );
};
