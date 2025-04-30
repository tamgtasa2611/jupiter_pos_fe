import React from "react";
import { Modal } from "antd";

const DeleteCustomerModal = ({ visible, onCancel, onDelete, customer }) => {
  const handleOk = () => {
    onDelete(customer.id);
  };

  return (
    <Modal
      title="Xóa khách hàng"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <p>
        Bạn có chắc chắn muốn xóa khách hàng <b>{customer?.name}</b>?
      </p>
    </Modal>
  );
};

export default DeleteCustomerModal;
