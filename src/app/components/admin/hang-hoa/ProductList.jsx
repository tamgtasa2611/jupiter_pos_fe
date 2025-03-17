import React from "react";
import { List, Flex, Dropdown, Button, Empty } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";

const ProductList = ({
  products,
  loading,
  pagination,
  setSelectedProduct,
  setViewModalVisible,
  setEditModalVisible,
  setDeleteModalVisible,
}) => {
  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      dataSource={products}
      pagination={{
        ...pagination,
        size: "small",
      }}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Dropdown
              key="actions"
              menu={{
                items: [
                  {
                    key: "view",
                    icon: <EyeOutlined />,
                    label: "Xem chi tiết",
                    onClick: () => {
                      setSelectedProduct(item);
                      setViewModalVisible(true);
                    },
                    style: { padding: "8px 12px" },
                  },
                  {
                    key: "edit",
                    icon: <EditOutlined />,
                    label: "Chỉnh sửa",
                    onClick: () => {
                      setSelectedProduct(item);
                      setEditModalVisible(true);
                    },
                    style: { padding: "8px 12px" },
                  },
                  {
                    key: "delete",
                    icon: <DeleteOutlined />,
                    label: "Xóa",
                    danger: true,
                    onClick: () => {
                      setSelectedProduct(item);
                      setDeleteModalVisible(true);
                    },
                    style: { padding: "8px 12px" },
                  },
                ],
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button shape="circle" size="large" icon={<MoreOutlined />} />
            </Dropdown>,
          ]}
        >
          <List.Item.Meta
            title={
              <Flex vertical>
                <span className="font-medium text-lg">{item.name}</span>
              </Flex>
            }
            description={
              <Flex vertical>
                <span className="font-semibold text-blue-600">
                  {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                </span>
                <Flex align="center" justify="space-between">
                  <span
                    className={`font-medium ${
                      item.stock < 10
                        ? "text-red-500"
                        : item.stock < 30
                        ? "text-orange-500"
                        : "text-green-600"
                    }`}
                  >
                    Tồn: {item.stock} {item.unit}
                  </span>
                </Flex>
              </Flex>
            }
          />
        </List.Item>
      )}
      locale={{
        emptyText: (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy sản phẩm nào" />
        ),
      }}
    />
  );
};

export default ProductList;
