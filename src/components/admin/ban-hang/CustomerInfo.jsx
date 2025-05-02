import React, { useState } from "react";
import { Card, Button, Space, Typography, Modal, Input, List } from "antd";
import { PlusOutlined, PhoneOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { Search } = Input;

const CustomerInfo = ({ customer, onSelectCustomer }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Mock customer data
  const mockCustomers = [
    { id: 1, name: "Nguyễn Văn A", phone: "0901234567", points: 150 },
    { id: 2, name: "Trần Thị B", phone: "0912345678", points: 80 },
    { id: 3, name: "Lê Văn C", phone: "0923456789", points: 210 },
  ];

  const filteredCustomers = mockCustomers.filter(
    (cust) =>
      cust.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      cust.phone.includes(searchValue),
  );

  return (
    <>
      <Card>
        {customer ? (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: "16px" }}>
              {customer.name}
            </Text>
            <Space align="center">
              <PhoneOutlined />
              <Text>{customer.phone}</Text>
            </Space>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text type="secondary">Điểm tích lũy: {customer.points}</Text>
              <Button
                type="text"
                danger
                size="small"
                onClick={() => onSelectCustomer(null)}
              >
                Xóa
              </Button>
            </div>
          </Space>
        ) : (
          <Space
            direction="vertical"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Title level={5} style={{ margin: "8px 0" }}>
              Khách hàng mới
            </Title>
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

      <Modal
        title="Chọn khách hàng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={400}
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
                <Text>{item.points} điểm</Text>
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
    </>
  );
};

export default CustomerInfo;
