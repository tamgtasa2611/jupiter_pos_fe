import { memo } from "react";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Memoize để tránh re-render khi không cần
const SearchBar = memo(
  ({ onSearch, loading, searchText, setSearchText, isMobile }) => {
    return (
      <Input.Search
        placeholder="Tìm kiếm theo tên, số điện thoại hoặc địa chỉ"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={onSearch}
        enterButton={
          loading ? (
            <Spin size="small" style={{ color: "white" }} />
          ) : (
            <SearchOutlined />
          )
        }
        readOnly={loading}
        style={{ width: isMobile ? "100%" : 300 }}
        allowClear
        onClear={() => onSearch("")}
      />
    );
  },
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
