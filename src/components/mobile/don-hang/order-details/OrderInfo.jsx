import React, { useState } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Typography,
  Button,
  Input,
  Select,
  Form,
  Space,
  App,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ORDER_TYPE_MAP, ORDER_STATUS_MAP } from "@constants/order";
import { updateOrderInfo } from "@/requests/order";
import { getCustomers } from "@/requests/customer";

const { Paragraph } = Typography;
const { TextArea } = Input;

const OrderInfo = ({ order, editable, fullyEditable, onOrderUpdate }) => {
  const { message } = App.useApp();
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async (search = "") => {
    setCustomerLoading(true);
    try {
      const res = await getCustomers({ page: 0, size: 10, search });
      const filteredCustomers = res?.content || []; 
      setCustomers(filteredCustomers);
    } catch (e) {
      setCustomers([]);
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    fetchCustomers();
    setSelectedCustomer(null);
    form.setFieldsValue({
      receiverName: order.receiverName || order.customer?.customerName || null,
      receiverPhone: order.receiverPhone || order.customer?.phone || null,
      receiverAddress: order.receiverAddress || order.customer?.address || null,
      note: order.note || null,
      orderType: order.orderType || null,
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await updateOrderInfo(order.id, values);
      message.success("Cập nhật thông tin đơn hàng thành công");
      setEditMode(false);

      if (onOrderUpdate) {
        onOrderUpdate();
      }
    } catch (error) {
      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin");
      } else {
        message.error("Cập nhật thông tin đơn hàng thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const orderTypeOptions = Object.entries(ORDER_TYPE_MAP).map(
    ([key, value]) => ({
      label: value.label,
      value: key,
    }),
  );

  // Khi chọn customer từ select
  const handleCustomerSelect = (value, option) => {
    const customer = customers.find((c) => c.id === value);
      if(customer){
      setSelectedCustomer(customer);
      form.setFieldsValue({
        receiverName: customer?.customerName || "",
        receiverPhone: customer?.phone || "",
        receiverAddress: customer?.address || "",
      });
    }else{
      form.setFieldsValue({
        receiverName: value || "",
      });
    }
  };

  // Khi user nhập tay tên khách hàng, reset selectedCustomer
  const handleCustomerInput = (value) => {
    setSelectedCustomer(value);
  };

  return (
    <Card>
      <Form form={form} layout="vertical">
        <Descriptions
          column={2}
          size="large"
          extra={
            editable &&
            editMode && (
              <Space>
                <Button icon={<CloseOutlined />} onClick={handleCancel}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={loading}
                >
                  Lưu
                </Button>
              </Space>
            )
          }
        >
          <Descriptions.Item label="Mã đơn hàng">{order.id}</Descriptions.Item>

          <Descriptions.Item label="Ngày đặt hàng">
            {order.orderDate
              ? dayjs(order.orderDate).format("DD/MM/YYYY HH:mm")
              : "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Người xử lý">
            {order?.user?.fullName || "-"}
          </Descriptions.Item>

          {/* Tên khách hàng - Editable */}
          <Descriptions.Item
            label={
              <Space>
                Tên khách hàng
                {editable && fullyEditable && !editMode && (
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ padding: 0, height: "auto" }}
                  />
                )}
              </Space>
            }
          >
            {editMode && fullyEditable ? (
              <Form.Item
                name="receiverName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên khách hàng" },
                ]}
                style={{ margin: 0 }}
              >
                <Select
                  mode="tags"
                  showSearch
                  allowClear
                  placeholder="Chọn hoặc nhập tên khách hàng"
                  filterOption={false}
                  notFoundContent={customerLoading ? "Đang tải..." : null}
                  onSearch={fetchCustomers}
                  onSelect={handleCustomerSelect}
                  onChange={handleCustomerInput}
                  onClear={() => setSelectedCustomer(null)}
                  value={form.getFieldValue("receiverName")}
                  style={{ width: "240px" }}
                  options={customers.map((c) => ({
                    label: c.customerName,
                    value: c.id,
                  }))}
                  // Cho phép nhập tay
                  labelInValue={false}
                  popupRender={(menu) => (
                    <>
                      {menu}
                      <div style={{ padding: 8, color: "#888", fontSize: 12 }}>
                        Gõ để tìm hoặc nhập mới
                      </div>
                    </>
                  )}
                />
              </Form.Item>
            ) : order.customer && order.customer.customerName ? (
              order.customer.customerName
            ) : (
              order.receiverName || "-"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag
              color={ORDER_STATUS_MAP[order.orderStatus]?.color || "default"}
            >
              {ORDER_STATUS_MAP[order.orderStatus]
                ? ORDER_STATUS_MAP[order.orderStatus].label
                : order.orderStatus}
            </Tag>
          </Descriptions.Item>

          {/* Số điện thoại - Editable */}
          <Descriptions.Item
            label={
              <Space>
                Số điện thoại
                {editable && fullyEditable && !editMode && (
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ padding: 0, height: "auto" }}
                  />
                )}
              </Space>
            }
          >
            {editMode && fullyEditable ? (
              <Form.Item
                name="receiverPhone"
                rules={[
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
                style={{ margin: 0 }}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            ) : (
              order.receiverPhone ||
              (order.customer && order.customer.phone) ||
              "-"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Tổng tiền">
            {order.totalAmount != null
              ? new Intl.NumberFormat("vi-VN").format(order.totalAmount) + " đ"
              : "-"}
          </Descriptions.Item>

          {/* Địa chỉ nhận hàng - Editable */}
          <Descriptions.Item
            label={
              <Space>
                Địa chỉ nhận hàng
                {editable && fullyEditable && !editMode && (
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ padding: 0, height: "auto" }}
                  />
                )}
              </Space>
            }
          >
            {editMode && fullyEditable ? (
              <Form.Item
                name="receiverAddress"
                style={{ margin: 0 }}
              >
                <Input placeholder="Nhập địa chỉ nhận hàng" />
              </Form.Item>
            ) : (
              order.receiverAddress ||
              (order.customer && order.customer.address) ||
              "-"
            )}
          </Descriptions.Item>

          {/* Hình thức mua hàng - Editable */}
          <Descriptions.Item
            label={
              <Space>
                Hình thức mua hàng
                {editable && fullyEditable && !editMode && (
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ padding: 0, height: "auto" }}
                  />
                )}
              </Space>
            }
          >
            {editMode && fullyEditable ? (
              <Form.Item
                name="orderType"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình thức mua hàng",
                  },
                ]}
                style={{ margin: 0 }}
              >
                <Select
                  options={orderTypeOptions}
                  placeholder="Chọn hình thức mua hàng"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            ) : order?.orderType && ORDER_TYPE_MAP[order.orderType] ? (
              ORDER_TYPE_MAP[order.orderType].label
            ) : (
              "-"
            )}
          </Descriptions.Item>

          {/* Ghi chú - Editable */}
          <Descriptions.Item
            label={
              <Space>
                Ghi chú
                {editable && !editMode && (
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ padding: 0, height: "auto" }}
                  />
                )}
              </Space>
            }
          >
            {editMode ? (
              <Form.Item name="note" style={{ margin: 0 }}>
                <TextArea rows={3} placeholder="Nhập ghi chú" />
              </Form.Item>
            ) : (
              <Paragraph ellipsis={{ rows: 2, tooltip: order.note }}>
                {order.note || "-"}
              </Paragraph>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Form>
    </Card>
  );
};

export default OrderInfo;
