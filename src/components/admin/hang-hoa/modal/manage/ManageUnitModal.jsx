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
  SearchOutlined,
} from "@ant-design/icons";
import {
  getPagableUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "@/requests/unit";

const { Title } = Typography;
const { Search } = Input;

const ManageUnitModal = ({ open, setOpen, reloadUnits, onCancel }) => {
  const [units, setUnits] = useState([]);
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

  const fetchUnits = async (
    page = 0,
    size = 5,
    sortField = sortBy,
    sortOrder = sortDirection,
    searchValue = searchText,
  ) => {
    setLoading(true);
    try {
      const response = await getPagableUnits({
        page,
        size,
        sortBy: sortField,
        sortDirection: sortOrder,
        search: searchValue || undefined,
      });

      if (response && response.content) {
        setUnits(response.content);
        setPagination((prev) => ({
          ...prev,
          total: response.totalElements,
          current: page + 1,
          pageSize: size,
        }));
      }
    } catch (error) {
      message.error("Lỗi khi tải đơn vị");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUnits();
    }
  }, [open]);

  const handleSearch = (value) => {
    const trimmed = value.trim();
    setSearchText(trimmed);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchUnits(0, pagination.pageSize, sortBy, sortDirection, trimmed);
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

      fetchUnits(newPage, newSize, newSortBy, newSortDirection, searchText);
    }
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: record.name,
    });
    setEditingKey(record.id);
    setOldName(record.name);
  };

  const cancel = () => {
    setEditingKey("");
    form.resetFields();
    setOldName("");
    setUnits((prev) => prev.filter((item) => !item.isNew));
  };

  const saveNew = async () => {
    try {
      const row = await form.validateFields();

      const response = await createUnit(row);

      if (
        response &&
        response?.response?.data?.error &&
        response?.response?.data?.message
      ) {
        message.error(response?.response?.data?.message);
        return;
      } else {
        message.success("Thêm đơn vị thành công");
        setSearchText("");
        fetchUnits(0, pagination.pageSize, sortBy, sortDirection, "");
        setEditingKey("");

        reloadUnits && reloadUnits();
      }
    } catch (errInfo) {
      message.error(errInfo?.response?.data?.message || "Lỗi khi thêm đơn vị");
    }
  };

  const update = async (id) => {
    try {
      const row = await form.validateFields();
      const name = row.name;
      const response = await updateUnit(id, name);

      if (name === oldName) {
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
          message.success("Cập nhật đơn vị thành công");
          fetchUnits(0, pagination.pageSize, sortBy, sortDirection);
          setEditingKey("");
          setOldName("");

          reloadUnits && reloadUnits();
        }
      }
    } catch (errInfo) {
      message.error(
        errInfo?.response?.data?.message || "Lỗi khi cập nhật đơn vị",
      );
    }
  };

  const handleAdd = () => {
    const newData = {
      id: `new_${Date.now()}`, // Thêm id để tránh lỗi key
      name: "",
      isNew: true,
    };
    setPagination((prev) => ({ ...prev, current: 1 }));

    fetchUnits(0, pagination.pageSize, sortBy, sortDirection).then(() => {
      setUnits((prev) => [newData, ...prev]);
      setEditingKey(newData.id);
      form.setFieldsValue({
        name: "",
      });
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteUnit(id);

      if (
        response &&
        response?.response?.data?.error &&
        response?.response?.data?.message
      ) {
        message.error(response?.response?.data?.message);
        return;
      } else {
        message.success("Xóa đơn vị thành công");
        fetchUnits(
          pagination.current - 1,
          pagination.pageSize,
          sortBy,
          sortDirection,
        );
        reloadUnits && reloadUnits();
      }
    } catch (errInfo) {
      message.error(errInfo?.response?.data?.message || "Lỗi khi xóa đơn vị");
    }
  };

  const handleRefresh = () => {
    fetchUnits(0, pagination.pageSize, sortBy, sortDirection);
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
      title: "Tên đơn vị",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        const editing = isEditing(record);
        return editing ? (
          <Form.Item
            name="name"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên đơn vị!",
              },
            ]}
          >
            <Input placeholder="Nhập tên đơn vị" />
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
              title="Bạn có chắc chắn muốn xóa đơn vị này?"
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
    setUnits((prev) => prev.filter((item) => !item.isNew));
  };

  return (
    <Modal
      title="Quản lý đơn vị"
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
          placeholder="Tìm kiếm đơn vị theo tên"
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
            Thêm đơn vị
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
          dataSource={units}
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

export default ManageUnitModal;
