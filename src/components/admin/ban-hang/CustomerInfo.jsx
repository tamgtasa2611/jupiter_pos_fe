import React, { useState, useEffect, memo } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Modal,
  Input,
  List,
  Pagination,
  Spin,
  Flex,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  ManOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserSwitchOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { getCustomers } from "@requests/customer";
import CreateCustomerModal from "./CreateCustomerModal";
import EditCustomerModal from "./EditCustomerModal";

const { Text, Title } = Typography;
const { Search } = Input;

const CustomerInfo = memo(({ customer, onSelectCustomer }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createCustomerModalVisible, setCreateCustomerModalVisible] =
    useState(false);
  const [editCustomerModalVisible, setEditCustomerModalVisible] =
    useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async (page = 0, search = "") => {
    setLoading(true);
    try {
      const params = {
        page: page > 0 ? page - 1 : page,
        size: pageSize,
        search: search ? search : undefined,
      };
      const response = await getCustomers(params);

      setCustomers(response.content || []);
      setTotalCustomers(response.totalElements || 0);
    } catch (error) {
      console.error("Lỗi khi tải khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchCustomers(currentPage, searchValue);
    }
  }, [isModalVisible, currentPage]);

  const handleSearch = async (value) => {
    const trimmedValue = value?.trim();
    setSearchValue(trimmedValue);
    setCurrentPage(0);
    await fetchCustomers(0, trimmedValue);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Card>
        {customer ? (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Flex justify="space-between" align="center">
              <Text strong style={{ fontSize: "16px" }}>
                {customer.customerName}
              </Text>

              <Button
                type="default"
                icon={<UserSwitchOutlined />}
                onClick={() => setIsModalVisible(true)}
              />
            </Flex>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginTop: 8 }}
            >
              <Space align="center">
                <PhoneOutlined />
                <Text>{customer.phone || "-"}</Text>
              </Space>
              <Button
                type="text"
                danger
                size="small"
                onClick={() => onSelectCustomer(null)}
              >
                Xóa
              </Button>
            </Flex>
          </Space>
        ) : (
          <Space
            direction="vertical"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              block
            >
              Chọn khách hàng
            </Button>
          </Space>
        )}
      </Card>

      {/* Chỉ render modal khi cần thiết */}
      {isModalVisible && (
        <Modal
          title="Chọn khách hàng"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSearchValue("");
            setCurrentPage(0);
          }}
          footer={null}
          centered
          width={480}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Search
              placeholder="Tìm khách hàng theo tên hoặc SĐT"
              allowClear
              enterButton
              value={searchValue}
              onChange={(e) => {
                const value = e.target.value;
                setSearchValue(value);

                if (value === "") {
                  handleSearch("");
                }
              }}
              onSearch={handleSearch}
            />
            {loading ? (
              <Flex
                justify="center"
                align="center"
                style={{ marginTop: 16, height: "364px" }}
              >
                <Spin
                  style={{
                    height: "100%",
                  }}
                />
              </Flex>
            ) : (
              <List
                style={{
                  height: "380px",
                  overflowY: "auto",
                }}
                dataSource={customers}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => {
                      onSelectCustomer(item);
                      setIsModalVisible(false);
                    }}
                    style={{ width: "100%", cursor: "pointer" }}
                  >
                    <Flex vertical style={{ width: "100%" }} gap={4}>
                      <Flex
                        justify="space-between"
                        align="center"
                        style={{ width: "100%" }}
                      >
                        <Flex gap={8}>
                          {item?.gender ? (
                            <ManOutlined
                              style={{ color: "var(--primary-color)" }}
                            />
                          ) : (
                            <WomanOutlined style={{ color: "#ff1493" }} />
                          )}
                          {item.customerName}
                        </Flex>
                        <Flex gap={8}>
                          <PhoneOutlined />
                          {item.phone || "-"}
                        </Flex>
                      </Flex>

                      <Flex justify="space-between" align="center" gap={8}>
                        <Tooltip title={item.address || "-"} placement="bottom">
                          <Text type="secondary" ellipsis>
                            {item.address || "-"}
                          </Text>
                        </Tooltip>
                        <Button
                          icon={<EditOutlined />}
                          type="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(item);
                            setEditCustomerModalVisible(true);
                          }}
                        ></Button>
                      </Flex>
                    </Flex>
                  </List.Item>
                )}
              />
            )}
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCustomers}
              onChange={handlePageChange}
              align="center"
              style={{ marginTop: 16, textAlign: "center" }}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              block
              style={{ marginTop: 16 }}
              onClick={() => {
                setCreateCustomerModalVisible(true);
              }}
            >
              Thêm khách hàng mới
            </Button>
          </Space>
        </Modal>
      )}

      <CreateCustomerModal
        visible={createCustomerModalVisible}
        onCancel={() => setCreateCustomerModalVisible(false)}
        onCreated={handleSearch}
      />

      <EditCustomerModal
        visible={editCustomerModalVisible}
        onCancel={() => setEditCustomerModalVisible(false)}
        onCreated={handleSearch}
        customer={selectedCustomer}
      />
    </>
  );
});

CustomerInfo.displayName = "CustomerInfo";

export default CustomerInfo;
