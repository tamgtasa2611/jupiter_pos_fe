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
  const columns = [
    {
      title: "Tên biến thể sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.originName}</div>
        </div>
      ),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "barcode",
      key: "barcode",
      width: 200,
      sorter: true,
      render: (barcode) => (
        <Tooltip title={barcode}>
          <div className="flex items-center">
            <BarcodeOutlined className="mr-1" />
            <span className="font-mono">{barcode}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 200,
      sorter: true,
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
      width: 200,
      sorter: true,
      render: (costPrice) => (
        <span className="text-gray-600">
          {new Intl.NumberFormat("vi-VN").format(costPrice)}đ
        </span>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      sorter: true,
      render: (quantity, record) => (
        <div>
          <span
            className={`font-semibold ${
              quantity <= 10
                ? "text-red-500"
                : quantity <= 30
                  ? "text-orange-500"
                  : "text-green-600"
            }`}
          >
            {quantity}
          </span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 160,
      sorter: true,
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Đang bán" : "Ngừng bán"}
        </Tag>
      ),
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 160,
      sorter: true,
      render: (createdDate) => (
        <span>
          {createdDate &&
            new Intl.DateTimeFormat("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(createdDate))}
        </span>
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
      scroll={{ x: 1000, y: "calc(100vh - 352px)" }}
      style={{ height: "100%" }}
      sticky
      size="middle"
      locale={{ emptyText: "Không có dữ liệu" }}
    />
  );
};

export default ProductTable;
