import React from "react";
import { Table, Button, Dropdown, Space, message } from "antd";
import { EditOutlined, MoreOutlined } from "@ant-design/icons";
import { updateProduct } from "@/requests/product"; // ensure correct import

const ProductTable = ({
  products,
  loading,
  pagination,
  handleTableChange,
  setSelectedProduct,
  setEditModalVisible,
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
                onClick: () => {},
              },
              {
                key: "edit",
                label: "Chỉnh sửa",
                icon: <EditOutlined />,
                onClick: () => {
                  setSelectedProduct(record);
                  setEditModalVisible(true);
                },
              },
              {
                key: "delete",
                label: "Ngừng kinh doanh",
                danger: true,
                onClick: async () => {
                  try {
                    await updateProduct(record.productId, { isDeleted: true });
                    message.success("Sản phẩm đã được xóa thành công");
                    fetchProducts(); // Refresh the product list
                  } catch (error) {
                    message.error("Lỗi khi ngừng kinh doanh sản phẩm");
                  }
                },
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
              { title: "Giá bán", dataIndex: "price", key: "price" },
              { title: "Tồn kho", dataIndex: "quantity", key: "quantity" },
              { title: "Trạng thái", dataIndex: "status", key: "status" },
              {
                title: "Ngày tạo",
                dataIndex: "createdDate",
                key: "createdDate",
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
                          onClick: () => {
                            setSelectedProduct(variant);
                            // Logic to view variant details can be added here
                          },
                        },
                        {
                          key: "edit",
                          label: "Chỉnh sửa",
                          icon: <EditOutlined />,
                          onClick: () => {
                            setSelectedProduct(record);
                            setEditVariantModalVisible(true);
                          },
                        },
                        {
                          key: "delete",
                          label: "Xóa biến thể",
                          danger: true,
                          onClick: async () => {
                            try {
                              await updateProduct(variant.id, {
                                isDeleted: true,
                              });
                              message.success(
                                "Biến thể đã được xóa thành công",
                              );
                              fetchProducts(); // Refresh the product list
                            } catch (error) {
                              message.error("Lỗi khi xóa biến thể");
                            }
                          },
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
