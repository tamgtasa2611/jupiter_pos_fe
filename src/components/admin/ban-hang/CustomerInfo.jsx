import React, { useState, memo } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Modal,
  Input,
  List,
  Flex,
} from "antd";
import {
  PlusOutlined,
  PhoneOutlined,
  EditOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Search } = Input;

// Mock customer data - đưa ra khỏi component để tránh khởi tạo lại
const mockCustomers = [
  { id: 1, name: "Khách lẻ", phone: "" },
  { id: 2, name: "Son Goku", phone: "0123456789" },
  { id: 3, name: "Vegeta", phone: "0987654321" },
  { id: 4, name: "Bulma", phone: "1234567890" },
  { id: 5, name: "Piccolo", phone: "9876543210" },
];

// Memoize để tránh re-render không cần thiết
const CustomerInfo = memo(({ customer, onSelectCustomer }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredCustomers = searchValue
    ? mockCustomers.filter(
        (cust) =>
          cust.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          cust.phone.includes(searchValue),
      )
    : mockCustomers;

  return (
    <>
      <Card>
        {customer ? (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Flex justify="space-between" align="center">
              <Text strong style={{ fontSize: "16px" }}>
                {customer.name}
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
                <Text>{customer.phone}</Text>
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
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={400}
          styles={{
            wrapper: { animation: "none" },
            body: { animation: "none" },
            content: { animation: "none" },
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Search
              placeholder="Tìm khách hàng theo tên hoặc SĐT"
              allowClear
              enterButton
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <List
              dataSource={filteredCustomers}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    onSelectCustomer(item);
                    setIsModalVisible(false);
                  }}
                >
                  <List.Item.Meta title={item.name} description={item.phone} />
                </List.Item>
              )}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              block
              style={{ marginTop: 16 }}
            >
              Thêm khách hàng mới
            </Button>
          </Space>
        </Modal>
      )}
    </>
  );
});

CustomerInfo.displayName = "CustomerInfo";

export default CustomerInfo;
