import React from "react";
import { Table, Button, Dropdown, Space, message, Tag } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { PRODUCT_STATUS } from "@/constants/product";
const ProductTable = ({
  products,
  loading,
  pagination,
  handleTableChange,
  setSelectedProductId,
  setSelectedVariantId,
  setViewProductModalVisible,
  setEditProductModalVisible,
  setAddVariantModalVisible,
  setViewVariantModalVisible,
  setEditVariantModalVisible,
  fetchProducts,
  handleUpdateProductStatus,
}) => {
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Danh mục",
      dataIndex: "categoryList",
      key: "categoryList",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const statusInfo = PRODUCT_STATUS[status];
        return statusInfo != null && statusInfo != undefined ? (
          <Tag color={statusInfo?.color || "default"}>
            {statusInfo?.label || "Không xác định"}
          </Tag>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Số biến thể",
      dataIndex: "variantsCount",
      key: "variantsCount",
      ellipsis: true,
      width: 100,
      render: (count) => count || 0,
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      key: "quantity",
      ellipsis: true,
      width: 100,
      render: (quantity) =>
        quantity <= 10 ? (
          <span style={{ color: "red" }}>{quantity}</span>
        ) : (
          <span style={{ color: "green" }}>{quantity}</span>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                label: "Xem chi tiết",
                icon: <EyeOutlined />,
                onClick: () => {
                  setSelectedProductId(record.productId);
                  setViewProductModalVisible(true);
                },
              },
              {
                key: "edit",
                label: "Chỉnh sửa",
                icon: <EditOutlined />,
                onClick: () => {
                  setSelectedProductId(record.productId);
                  setEditProductModalVisible(true);
                },
              },
              {
                key: "add-variant",
                label: "Thêm biến thể",
                icon: <PlusOutlined />,
                onClick: () => {
                  setSelectedProductId(record.productId);
                  setAddVariantModalVisible(true);
                },
              },
            ],
          }}
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
      rowKey="productId"
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
      bordered
      scroll={{ x: 1000, y: "calc(100vh - 352px)" }}
      style={{ height: "100%" }}
      sticky
      expandable={{
        expandedRowRender: (record) => (
          <Table
            bordered
            columns={[
              {
                title: "Thuộc tính biến thể",
                dataIndex: "name",
                key: "name",
                ellipsis: true,
              },
              {
                title: "SKU",
                dataIndex: "sku",
                key: "sku",
                ellipsis: true,
                width: 160,
              },
              {
                title: "Mã vạch",
                dataIndex: "barcode",
                key: "barcode",
                ellipsis: true,
                width: 160,
              },
              {
                title: "Giá nhập",
                dataIndex: "costPrice",
                key: "costPrice",
                ellipsis: true,
                width: 120,
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
                width: 120,
                ellipsis: true,
                render: (value) =>
                  value != null
                    ? value.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "-",
              },
              {
                title: "Tồn kho",
                dataIndex: "quantity",
                key: "quantity",
                ellipsis: true,
                width: 100,
                render: (quantity) =>
                  quantity <= 10 ? (
                    <span style={{ color: "red" }}>{quantity}</span>
                  ) : (
                    <span style={{ color: "green" }}>{quantity}</span>
                  ),
              },
              {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 100,
                render: (status) => {
                  const statusInfo = PRODUCT_STATUS[status];
                  return statusInfo != null && statusInfo != undefined ? (
                    <Tag color={statusInfo?.color || "default"}>
                      {statusInfo?.label || "Không xác định"}
                    </Tag>
                  ) : (
                    "-"
                  );
                },
              },
              {
                title: "Ngày tạo",
                dataIndex: "createdDate",
                key: "createdDate",
                width: 100,
                render: (date) =>
                  date ? new Date(date).toLocaleDateString("vi-VN") : "-",
              },
              {
                title: "Thao tác",
                key: "actions",
                width: 100,
                render: (_, variant) => (
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: [
                        {
                          key: "view",
                          label: "Xem chi tiết",
                          icon: <EyeOutlined />,
                          onClick: () => {
                            setSelectedVariantId(variant.id);
                            setViewVariantModalVisible(true);
                          },
                        },
                        {
                          key: "edit",
                          label: "Chỉnh sửa",
                          icon: <EditOutlined />,
                          onClick: () => {
                            setSelectedVariantId(variant.id);
                            setEditVariantModalVisible(true);
                          },
                        },
                      ],
                    }}
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                ),
              },
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
