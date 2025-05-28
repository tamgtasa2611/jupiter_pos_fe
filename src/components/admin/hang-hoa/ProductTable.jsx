import React from "react";
import { Table, Button, Dropdown, Space, message } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { updateProduct } from "@/requests/product"; // ensure correct import

const ProductTable = ({
  products,
  loading,
  pagination,
  handleTableChange,
  setSelectedProduct,
  setSelectedVariant, // for editing a variant if needed
  setEditProductModalVisible,
  setEditVariantModalVisible, // for editing a variant if needed
  fetchProducts, // callback to refresh products list
}) => {
  const columns = [
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      ellipsis: true,
    },
    { title: "Số biến thể", dataIndex: "variantsCount", key: "variantsCount" },
    { title: "Tồn kho", dataIndex: "quantity", key: "quantity" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "Xem chi tiết",
                icon: <EyeOutlined />,
                onClick: () => {},
              },
              {
                key: "edit",
                label: "Chỉnh sửa",
                icon: <EditOutlined />,
                onClick: () => {
                  console.log("Edit product clicked", record);
                  setSelectedProduct(record); // đảm bảo record có dữ liệu
                  setEditProductModalVisible(true);
                },
              },
              {
                key: "delete",
                label: "Ngừng kinh doanh",
                danger: true,
                icon: <StopOutlined />,
                onClick: async () => {},
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
    // ...các cột khác...
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="productId"
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
      scroll={{ x: 1000, y: "calc(100vh - 352px)" }}
      style={{ height: "100%" }}
      sticky
      expandable={{
        expandedRowRender: (record) => (
          <Table
            columns={[
              { title: "Tên biến thể", dataIndex: "name", key: "name" },
              { title: "SKU", dataIndex: "sku", key: "sku" },
              { title: "Mã vạch", dataIndex: "barcode", key: "barcode" },
              {
                title: "Giá nhập",
                dataIndex: "costPrice",
                key: "costPrice",
                render: (value) =>
                  value != null
                    ? value.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "-",
              },
              {
                title: "Giá bán",
                dataIndex: "price",
                key: "price",
                render: (value) =>
                  value != null
                    ? value.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "-",
              },
              { title: "Tồn kho", dataIndex: "quantity", key: "quantity" },
              { title: "Trạng thái", dataIndex: "status", key: "status" },
              {
                title: "Ngày tạo",
                dataIndex: "createdDate",
                key: "createdDate",
                render: (date) =>
                  date ? new Date(date).toLocaleDateString("vi-VN") : "-",
              },
              {
                title: "Thao tác",
                key: "actions",
                render: (_, variant) => (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "view",
                          label: "Xem chi tiết",
                          icon: <EyeOutlined />,
                          onClick: () => {
                            setSelectedVariant(variant); // Lưu variant đang chọn
                            // Logic to view variant details can be added here
                          },
                        },
                        {
                          key: "edit",
                          label: "Chỉnh sửa",
                          icon: <EditOutlined />,
                          onClick: () => {
                            setSelectedVariant(variant); // Lưu variant đang chọn
                            setEditVariantModalVisible(true); // Mở modal sửa variant
                          },
                        },
                        {
                          key: "delete",
                          label: "Ngừng kinh doanh",
                          icon: <StopOutlined />,
                          danger: true,
                          onClick: async () => {},
                        },
                      ],
                    }}
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                ),
              },
              // ...các cột khác...
            ]}
            dataSource={record.variants}
            rowKey="id"
            pagination={false}
            size="small"
          />
        ),
        rowExpandable: (record) =>
          record.variants && record.variants.length > 0,
      }}
      size="middle"
      locale={{ emptyText: "Không có dữ liệu" }}
    />
  );
};

export default ProductTable;
