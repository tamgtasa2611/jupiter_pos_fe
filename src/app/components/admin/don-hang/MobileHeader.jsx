import React from "react";
import { Flex, Input, Button, Divider } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const MobileHeader = ({ searchText, onSearch, onFilterClick }) => {
  return (
    <>
      <Flex gap="middle">
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          size="large"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
        <Button size="large" icon={<FilterOutlined />} onClick={onFilterClick}></Button>
      </Flex>
      <Divider style={{ marginBottom: 0 }} />
    </>
  );
};

export default MobileHeader;
