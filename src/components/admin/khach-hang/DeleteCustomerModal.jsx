import React from "react";
import { Modal, message } from "antd";
import { deleteCustomer } from "@/requests/customer";

const DeleteCustomerModal = ({ visible, onCancel, customer }) => {
  const handleOk = async () => {
    try {
      if (!customer) return;
      const res = await deleteCustomer(customer.id);
      if (res) {
        message.error(res || "Xóa khách hàng thất bại!");
        return;
      }
      message.success("Xóa khách hàng thành công!");
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Xóa khách hàng thất bại!",
      );
    }
  };

  return (
    <Modal
      title="Xác nhận xóa khách hàng"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <p>
        Bạn có chắc chắn muốn xóa khách hàng <b>{customer?.customerName}</b>?
      </p>
    </Modal>
  );
};

export default DeleteCustomerModal;
