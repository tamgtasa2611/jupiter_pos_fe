import React from "react";
import { Typography, Button, Flex } from "antd";
import {
  MenuOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const ProductHeader = ({
  isMobile,
  setMenuDrawerOpen,
  setFilterDrawerOpen,
  onRefresh
}) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      wrap="wrap"
      style={{ marginBottom: 16 }}
      className="h-auto"
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
          Hàng hóa
        </Title>
      </div>

      {/* Mobile Filter Button */}
      {isMobile && (
        <Flex gap="middle">
          <Button
            size="large"
            icon={<SortAscendingOutlined />}
            onClick={() => {}}
          ></Button>
          <Button
            size="large"
            icon={<FilterOutlined />}
            onClick={() => setFilterDrawerOpen(true)}
          ></Button>
        </Flex>
      )}
    </Flex>
  );
};

export default ProductHeader;
