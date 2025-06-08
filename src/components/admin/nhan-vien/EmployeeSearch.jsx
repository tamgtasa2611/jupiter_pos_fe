import React, { memo } from "react";
import { Input, Button, Space, Spin } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const EmployeeSearch = memo(
  ({ onSearch, loading, searchText, setSearchText, isMobile }) => {
    return (
      <Input.Search
        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        // Chỉ gọi API khi bấm Enter hoặc click nút tìm kiếm
        onSearch={onSearch}
        enterButton={
          loading ? (
            <Spin size="small" style={{ color: "white" }} />
          ) : (
            <SearchOutlined />
          )
        }
        readOnly={loading}
        style={{ width: isMobile ? "100%" : 360 }}
        allowClear
        onClear={() => onSearch("")}
      />
    );
  },
);

EmployeeSearch.displayName = "EmployeeSearch";

export default EmployeeSearch;
