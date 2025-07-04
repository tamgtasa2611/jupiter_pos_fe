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
  onRefresh,
  onManageCategoriesClick,
  onManageAttributesClick,
  onManageUnitsClick,
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

      <Flex gap="middle" align="center">
        <Button type="default" onClick={onManageCategoriesClick}>
          Quản lý danh mục
        </Button>

        <Button type="default" onClick={onManageAttributesClick}>
          Quản lý thuộc tính
        </Button>

        <Button type="default" onClick={onManageUnitsClick}>
          Quản lý đơn vị
        </Button>
      </Flex>

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
