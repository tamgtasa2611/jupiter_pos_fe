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
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  getPagableAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from "@/requests/attribute";

const { Title } = Typography;
const { Search } = Input;

const ManageAttributeModal = ({
  open,
  setOpen,
  reloadAttributes,
  onCancel,
}) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [searchText, setSearchText] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [editingKey, setEditingKey] = useState("");
  const [oldName, setOldName] = useState("");
  const [form] = Form.useForm();

  const fetchAttributes = async (
    page = 0,
    size = 5,
    sortField = sortBy,
    sortOrder = sortDirection,
    searchValue = searchText,
  ) => {
    setLoading(true);
    try {
      const response = await getPagableAttributes({
        page,
        size,
        sortBy: sortField,
        sortDirection: sortOrder,
        search: searchValue || undefined,
      });

      if (response && response.content) {
        setAttributes(response.content);
        setPagination((prev) => ({
          ...prev,
          total: response.totalElements,
          current: page + 1,
          pageSize: size,
        }));
      }
    } catch (error) {
      message.error("Lỗi khi tải thuộc tính");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAttributes();
    }
  }, [open]);

  const handleSearch = (value) => {
    const trimmed = value.trim();
    setSearchText(trimmed);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchAttributes(0, pagination.pageSize, sortBy, sortDirection, trimmed);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    if (editingKey !== "") {
      return;
    } else {
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

      fetchAttributes(
        newPage,
        newSize,
        newSortBy,
        newSortDirection,
        searchText,
      );
    }
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      attributeName: record.attributeName,
    });
    setEditingKey(record.id);
    setOldName(record.attributeName);
  };

  const cancel = () => {
    setEditingKey("");
    form.resetFields();
    setOldName("");
    setAttributes((prev) => prev.filter((item) => !item.isNew));
  };

  const saveNew = async () => {
    try {
      const row = await form.validateFields();

      const response = await createAttribute(row);

      if (
        response &&
        response?.response?.data?.error &&
        response?.response?.data?.message
      ) {
        message.error(response?.response?.data?.message);
        return;
      } else {
        message.success("Thêm thuộc tính thành công");
        setSearchText("");
        fetchAttributes(0, pagination.pageSize, sortBy, sortDirection, "");
        setEditingKey("");
        reloadAttributes && reloadAttributes();
      }
    } catch (errInfo) {
      message.error(
        errInfo?.response?.data?.message || "Lỗi khi thêm thuộc tính",
      );
    }
  };

  const update = async (id) => {
    try {
      const row = await form.validateFields();
      const attributeName = row.attributeName;
      const response = await updateAttribute(id, attributeName);

      if (attributeName === oldName) {
        message.info("Không có thay đổi nào để cập nhật");
        setEditingKey("");
        form.resetFields();
        setOldName("");
        return;
      } else {
        if (
          response &&
          response?.response?.data?.error &&
          response?.response?.data?.message
        ) {
          message.error(response?.response?.data?.message);
          return;
        } else {
          message.success("Cập nhật thuộc tính thành công");
          fetchAttributes(
            pagination.current - 1,
            pagination.pageSize,
            sortBy,
            sortDirection,
          );
          setEditingKey("");
          setOldName("");
          reloadAttributes && reloadAttributes();
        }
      }
    } catch (errInfo) {
      message.error(
        errInfo?.response?.data?.message || "Lỗi khi cập nhật thuộc tính",
      );
    }
  };

  const handleAdd = () => {
    const newData = {
      id: `new_${Date.now()}`, // Thêm id để tránh lỗi key
      attributeName: "",
      isNew: true,
    };
    setPagination((prev) => ({ ...prev, current: 1 }));

    fetchAttributes(0, pagination.pageSize, sortBy, sortDirection).then(() => {
      setAttributes((prev) => [newData, ...prev]);
      setEditingKey(newData.id);
      form.setFieldsValue({
        attributeName: "",
      });
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteAttribute(id);

      if (
        response &&
        response?.response?.data?.error &&
        response?.response?.data?.message
      ) {
        message.error(response?.response?.data?.message);
        return;
      } else {
        message.success("Xóa thuộc tính thành công");
        fetchAttributes(
          pagination.current - 1,
          pagination.pageSize,
          sortBy,
          sortDirection,
        );
        reloadAttributes && reloadAttributes();
      }
    } catch (errInfo) {
      message.error(
        errInfo?.response?.data?.message || "Lỗi khi xóa thuộc tính",
      );
    }
  };

  const handleRefresh = () => {
    fetchAttributes(0, pagination.pageSize, sortBy, sortDirection);
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
      title: "Tên thuộc tính",
      dataIndex: "attributeName",
      key: "attributeName",
      render: (text, record) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="attributeName"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên thuộc tính!",
              },
            ]}
          >
            <Input placeholder="Nhập tên thuộc tính" />
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
              title="Bạn có chắc chắn muốn xóa thuộc tính này?"
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
    setOldName("");
    setSearchText("");
    setAttributes((prev) => prev.filter((item) => !item.isNew));
  };

  return (
    <Modal
      title="Quản lý thuộc tính"
      centered
      maskClosable={false}
      width={800}
      open={open}
      onCancel={handleModalClose}
      footer={
        <Flex justify="end" align="center">
          <Button onClick={handleModalClose} icon={<CloseOutlined />}>
            Đóng
          </Button>
        </Flex>
      }
    >
      <Flex
        justify="space-between"
        gap={16}
        style={{ marginBottom: 16, marginTop: 16 }}
      >
        <Search
          placeholder="Tìm kiếm danh mục theo tên"
          allowClear
          enterButton={<SearchOutlined />}
          size="middle"
          onSearch={handleSearch}
          onChange={handleSearchChange}
          value={searchText}
          disabled={editingKey !== ""}
        />

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
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={attributes}
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

export default ManageAttributeModal;
