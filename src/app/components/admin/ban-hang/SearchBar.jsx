import React from 'react';
import { Input } from 'antd';
import { SearchOutlined, BarcodeOutlined } from '@ant-design/icons';

const SearchBar = ({ onSearch }) => {
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
};

export default SearchBar;