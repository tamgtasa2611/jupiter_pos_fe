import React from "react";
import { Input, Select, Flex } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const ProductFilters = ({
  searchText,
  setSearchText,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories,
  isMobile,
  onSearch,
}) => {
  return (
    <Flex gap={12} wrap="wrap">
      <Input
        placeholder="Tìm kiếm theo tên, mã sản phẩm..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={(e) => onSearch(e.target.value)}
        style={{ width: isMobile ? "100%" : 300 }}
        allowClear
      />

      <Select
        placeholder="Danh mục"
        style={{ width: isMobile ? "100%" : 150 }}
        value={selectedCategory}
        onChange={setSelectedCategory}
        allowClear
      >
        <Option value="0">Tất cả danh mục</Option>
        {categories.map((category) => (
          <Option key={category.id} value={category.categoryName}>
            {category.categoryName}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Trạng thái"
        style={{ width: isMobile ? "100%" : 150 }}
        value={selectedStatus}
        onChange={setSelectedStatus}
        allowClear
      >
        <Option value="0">Tất cả trạng thái</Option>
        <Option value="active">Đang bán</Option>
        <Option value="inactive">Ngừng bán</Option>
      </Select>
    </Flex>
  );
};

export default ProductFilters;
