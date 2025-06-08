import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, message } from "antd";
import { getCustomerById } from "@/requests/customer";

const ViewCustomerModal = ({ visible, onCancel, customerId }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && customerId) {
      setLoading(true);
      getCustomerById(customerId)
        .then((res) => {
          setCustomer(res);
        })
        .catch((error) => {
          message.error("Lỗi khi tải thông tin khách hàng");
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, customerId]);

  return (
    <Modal
      title="Xem chi tiết khách hàng"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={800}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Spin />
        </div>
      ) : customer ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên khách hàng">
            {customer.customerName}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {customer.gender ? "Nam" : "Nữ"}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {customer.address}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {customer.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng chi tiêu">
            {new Intl.NumberFormat("vi-VN").format(customer.totalSpent)}đ
          </Descriptions.Item>
          <Descriptions.Item label="Tổng đơn hàng">
            {customer.totalOrders}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </Modal>
  );
};

export default ViewCustomerModal;
