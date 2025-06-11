import React from "react";
import { Modal } from "antd";

const DeleteEmployeeModal = ({ visible, onCancel, onDelete, employee }) => (
  <Modal
    open={visible}
    title="Xác nhận xóa nhân viên"
    onCancel={onCancel}
    onOk={onDelete}
    okText="Xóa"
    cancelText="Hủy"
    okButtonProps={{ danger: true }}
  >
    <p>
      Bạn có chắc chắn muốn xóa nhân viên <b>{employee?.fullName}</b>?
    </p>
  </Modal>
);

export default DeleteEmployeeModal;
