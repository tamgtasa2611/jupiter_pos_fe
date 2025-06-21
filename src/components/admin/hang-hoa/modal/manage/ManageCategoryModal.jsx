import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  Space,
  Form,
  Input,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Typography,
  Flex,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  getPagableCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/requests/category";

const { Title } = Typography;

const ManageCategoryModal = ({ open, setOpen, reloadCategories, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();

  const fetchCategories = async (
    page = 0,
    size = 5,
    sortField = sortBy,
    sortOrder = sortDirection,
  ) => {
    setLoading(true);
    try {
      const response = await getPagableCategories({
        page,
        size,
        sortBy: sortField,
        sortDirection: sortOrder,
      });

      if (response && response.content) {
        setCategories(response.content);
        setPagination((prev) => ({
          ...prev,
          total: response.totalElements,
          current: page + 1,
          pageSize: size,
        }));
      }
    } catch (error) {
      message.error("Lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleTableChange = (newPagination, filters, sorter) => {
    let newSortBy = sortBy;
    let newSortDirection = sortDirection;

    if (sorter && sorter.field) {
      newSortBy = sorter.field;
      newSortDirection = sorter.order === "ascend" ? "ASC" : "DESC";
      setSortBy(newSortBy);
      setSortDirection(newSortDirection);
    }

    const newPage = newPagination.current - 1;
    const newSize = newPagination.pageSize;

    fetchCategories(newPage, newSize, newSortBy, newSortDirection);
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      categoryName: record.categoryName,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
    form.resetFields();

    setCategories((prev) => prev.filter((item) => !item.isNew));
  };

  const saveNew = async () => {
    try {
      const row = await form.validateFields();

      const response = await createCategory(row);

      if (
        response &&
        response?.response?.data?.error &&
        response?.response?.data?.message
      ) {
        message.error(response?.response?.data?.message);
        return;
      } else {
        message.success("Thêm danh mục thành công");
        fetchCategories(0, pagination.pageSize, sortBy, sortDirection);
        setEditingKey("");
        reloadCategories && reloadCategories();
      }
    } catch (errInfo) {
      message.error(
        errInfo?.response?.data?.message || "Lỗi khi thêm danh mục",
      );
    }
  };

  const update = async (id) => {
    try {
      const row = await form.validateFields();
      const categoryName = row.categoryName;
      const response = await updateCategory(id, categoryName);

      if (
        response &&
        response?.response?.data?.error &&
        response?.response?.data?.message
      ) {
        message.error(response?.response?.data?.message);
        return;
      } else {
        message.success("Cập nhật danh mục thành công");
        fetchCategories(
          pagination.current - 1,
          pagination.pageSize,
          sortBy,
          sortDirection,
        );
        setEditingKey("");
        reloadCategories && reloadCategories();
      }
    } catch (errInfo) {
      message.error(
        errInfo?.response?.data?.message || "Lỗi khi cập nhật danh mục",
      );
    }
  };

  const handleAdd = () => {
    const newData = {
      id: `new_${Date.now()}`, // Thêm id để tránh lỗi key
      categoryName: "",
      isNew: true,
    };
    setCategories([newData, ...categories]);
    setEditingKey(newData.id);
    form.setFieldsValue({
      categoryName: "",
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id);

      if (
        response &&
        response?.response?.data?.error &&
        response?.response?.data?.message
      ) {
        message.error(response?.response?.data?.message);
        return;
      } else {
        message.success("Xóa danh mục thành công");
        fetchCategories(
          pagination.current - 1,
          pagination.pageSize,
          sortBy,
          sortDirection,
        );
        reloadCategories && reloadCategories();
      }
    } catch (errInfo) {
      message.error(errInfo?.response?.data?.message || "Lỗi khi xóa danh mục");
    }
  };

  const handleRefresh = () => {
    fetchCategories(0, pagination.pageSize, sortBy, sortDirection);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: true,
      render: (text, record) => {
        return record.isNew ? "Mới" : text;
      },
    },
    {
      title: "Tên danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text, record) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="categoryName"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên danh mục!",
              },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
        ) : (
          text
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, record) => {
        const editing = isEditing(record);

        if (editing) {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<SaveOutlined />}
                onClick={() => (record.isNew ? saveNew() : update(record.id))}
              >
                Lưu
              </Button>
              <Button size="small" icon={<CloseOutlined />} onClick={cancel}>
                Hủy
              </Button>
            </Space>
          );
        }

        return (
          <Space>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== ""}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa danh mục này?"
              onConfirm={() => handleDelete(record.id)}
              disabled={editingKey !== ""}
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                disabled={editingKey !== ""}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleModalClose = () => {
    onCancel();
    setEditingKey("");
    form.resetFields();
    setCategories((prev) => prev.filter((item) => !item.isNew));
  };

  return (
    <Modal
      title="Quản lý danh mục"
      centered
      maskClosable={false}
      width={800}
      open={open}
      onCancel={handleModalClose}
      footer={
        <Flex justify="space-between" align="center">
          <Button onClick={handleModalClose} icon={<CloseOutlined />}>
            Đóng
          </Button>
          <Flex>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              disabled={editingKey !== ""}
            >
              Thêm danh mục
            </Button>
            <Button
              type="default"
              onClick={handleRefresh}
              style={{ marginLeft: 8 }}
              icon={<ReloadOutlined />}
              loading={loading}
            />
          </Flex>
        </Flex>
      }
    >
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={categories}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
          }}
          onChange={handleTableChange}
          size="middle"
          style={{ marginTop: 24 }}
        />
      </Form>
    </Modal>
  );
};

export default ManageCategoryModal;
