import React from "react";
import { Flex, Typography, Button } from "antd";
import {
  MenuOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const OrderHeader = ({ isMobile, setMenuDrawerOpen, setFilterDrawerOpen }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      wrap="wrap"
      style={{ marginBottom: 16 }}
    >
      <div>
        <Title level={4} style={{ margin: 0 }}>
          {isMobile && (
            <Button
              size="large"
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMenuDrawerOpen(true)}
              style={{ marginRight: 8 }}
            />
          )}
          Đơn hàng
        </Title>
      </div>

      {isMobile && (
        <Flex gap="middle">
          <Button
            size="large"
            icon={<SortAscendingOutlined />}
            onClick={() => {}}
          />
          <Button
            size="large"
            icon={<FilterOutlined />}
            onClick={() => setFilterDrawerOpen(true)}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default OrderHeader;
