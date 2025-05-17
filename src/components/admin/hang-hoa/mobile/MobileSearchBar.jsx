import React from "react";
import { Input, Button, Flex, Divider } from "antd";
import { SearchOutlined, ScanOutlined } from "@ant-design/icons";

const MobileSearchBar = ({ searchText, updateSearchText, handleScanCode }) => {
  return (
    <>
      <Flex gap="middle">
        <Input
          placeholder="Tìm kiếm theo tên, mã sản phẩm..."
          size="large"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => updateSearchText(e.target.value)}
          allowClear
        />
        <Button
          style={{ width: "48px", height: "40px" }}
          icon={<ScanOutlined />}
          onClick={handleScanCode}
        ></Button>
      </Flex>
      <Divider style={{ marginBottom: 0 }} />
    </>
  );
};

export default MobileSearchBar;
