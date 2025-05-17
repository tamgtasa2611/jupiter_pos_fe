import React from "react";
import { Flex, Input, Button, Divider } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const MobileHeader = ({ searchText, onSearch }) => {
  return (
    <>
      <Flex gap="middle" className="w-full">
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          size="large"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
      </Flex>
      <Divider style={{ marginBottom: 0 }} />
    </>
  );
};

export default MobileHeader;
