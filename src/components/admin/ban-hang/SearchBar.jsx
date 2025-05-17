import React, { memo } from "react";
import { Input } from "antd";
import { SearchOutlined, BarcodeOutlined } from "@ant-design/icons";

// Memoize để tránh re-render khi không cần
const SearchBar = memo(({ onSearch }) => {
  return (
    <Input.Search
      placeholder="Tìm kiếm sản phẩm hoặc quét mã vạch"
      allowClear
      enterButton={<SearchOutlined />}
      size="large"
      onChange={(e) => onSearch(e.target.value)}
      prefix={<BarcodeOutlined />}
    />
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
