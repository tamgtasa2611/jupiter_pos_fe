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
} from "antd";
import {
  PhoneOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { getCustomers } from "@requests/customer";
import CreateCustomerModal from "./CreateCustomerModal";

const { Text, Title } = Typography;
const { Search } = Input;

const CustomerInfo = memo(({ customer, onSelectCustomer }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createCustomerModalVisible, setCreateCustomerModalVisible] =
    useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5); // Điều chỉnh số mục mỗi trang nếu cần
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async (page = 0, search = "") => {
    setLoading(true);
    try {
      // Backend giả sử yêu cầu page bắt đầu từ 0
      const params = {
        page: page > 0 ? page - 1 : page, // Chuyển đổi sang 0-based index nếu cần
        size: pageSize,
        search: search ? search : undefined,
      };
      const response = await getCustomers(params);
      // Giả sử API trả về dữ liệu dạng: { content: [...], totalElements: number }
      setCustomers(response.content || []);
      setTotalCustomers(response.totalElements || 0);
    } catch (error) {
      // Xử lý lỗi (có thể hiển thị message.error)
      console.error("Lỗi khi tải khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lại danh sách khách hàng khi Modal mở, hoặc khi currentPage/search thay đổi
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
            setSearchValue(""); // Reset search value khi đóng modal
            setCurrentPage(0); // Reset về trang đầu tiên
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
              // Khi người dùng nhập, cập nhật giá trị tìm kiếm
              value={searchValue}
              onChange={(e) => {
                const value = e.target.value;
                setSearchValue(value);
                // Nếu cleared (rỗng) thì search lại
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
                style={{ marginTop: 16, height: "348px" }}
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
                  height: "364px",
                  overflowY: "auto",
                }}
                dataSource={customers}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      onSelectCustomer(item);
                      setIsModalVisible(false);
                    }}
                  >
                    <List.Item.Meta
                      title={item.customerName}
                      description={`${item.phone} - ${item.address}`}
                    />
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
        onCreated={(newCustomer) => {
          handleSearch();
        }}
      />
    </>
  );
});

CustomerInfo.displayName = "CustomerInfo";

export default CustomerInfo;
