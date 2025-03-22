import React from "react";
import { Table, Dropdown, Button, Tag, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const ProductTable = ({
  products,
  loading,
  pagination,
  handleTableChange,
  setSelectedProduct,
  setViewModalVisible,
  setEditModalVisible,
  setDeleteModalVisible,
}) => {
  const router = useRouter();
  const categories = [
    { value: "beverages", label: "Đồ uống" },
    { value: "food", label: "Thực phẩm" },
    { value: "snacks", label: "Bánh kẹo" },
    { value: "household", label: "Đồ gia dụng" },
    { value: "personal_care", label: "Chăm sóc cá nhân" },
  ];

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "barcode",
      key: "barcode",
      render: (barcode) => (
        <Tooltip title={barcode}>
          <div className="flex items-center">
            <BarcodeOutlined className="mr-1" />
            <span className="font-mono">{barcode}</span>
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => a.barcode.localeCompare(b.barcode),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      filters: categories.map((cat) => ({ text: cat.label, value: cat.value })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <span className="font-semibold text-blue-600">
          {new Intl.NumberFormat("vi-VN").format(price)}đ
        </span>
      ),
    },
    {
      title: "Giá nhập",
      dataIndex: "costPrice",
      key: "costPrice",
      sorter: (a, b) => a.costPrice - b.costPrice,
      render: (costPrice) => (
        <span className="text-gray-600">{new Intl.NumberFormat("vi-VN").format(costPrice)}đ</span>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock, record) => (
        <div>
          <span
            className={`font-semibold ${
              stock < 10 ? "text-red-500" : stock < 30 ? "text-orange-500" : "text-green-600"
            }`}
          >
            {stock}
          </span>
          <span className="text-gray-500 ml-1">{record.unit}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Đang bán" : "Ngừng bán"}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <EyeOutlined />,
                label: "Xem chi tiết",
                onClick: () => {
                  setSelectedProduct(record);
                  setViewModalVisible(true);
                },
              },
              {
                key: "2",
                icon: <EditOutlined />,
                label: "Chỉnh sửa",
                onClick: () => {
                  setSelectedProduct(record);
                  setEditModalVisible(true);
                },
              },
              {
                key: "3",
                icon: <DeleteOutlined />,
                label: "Xóa",
                danger: true,
                onClick: () => {
                  setSelectedProduct(record);
                  setDeleteModalVisible(true);
                },
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
      scroll={{ x: 1000, y: 600 }}
      className=""
      size="middle"
    />
  );
};

export default ProductTable;
