import React, { memo } from "react";
import { Input, Spin } from "antd";
import { SearchOutlined, BarcodeOutlined } from "@ant-design/icons";

const SearchBar = memo(({ onSearch, loading }) => {
  return (
    <Input.Search
      placeholder="Tìm kiếm sản phẩm hoặc quét mã vạch"
      allowClear
      enterButton={
        loading ? (
          <Spin size="small" style={{ color: "white" }} />
        ) : (
          <SearchOutlined />
        )
      }
      size="large"
      onSearch={onSearch}
      prefix={<BarcodeOutlined />}
      readOnly={loading} // Chặn người dùng khi loading
    />
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
