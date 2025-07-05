import React from "react";
import { Input, Select, Flex, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DANG_BAN, NGUNG_BAN } from "@/constants/product";

const { Option } = Select;

const ProductFilters = ({
  loading,
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
      <Input.Search
        placeholder="Tìm kiếm theo tên, mã sản phẩm..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={(e) => onSearch(e.target.value)}
        style={{ width: isMobile ? "100%" : 300 }}
        allowClear
        onClear={() => onSearch("")}
        enterButton={
          loading ? (
            <Spin size="small" style={{ color: "white" }} />
          ) : (
            <SearchOutlined />
          )
        }
        readOnly={loading}
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
          <Option key={category.id} value={category.id}>
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
        <Option value={DANG_BAN}>Đang bán</Option>
        <Option value={NGUNG_BAN}>Ngừng bán</Option>
      </Select>
    </Flex>
  );
};

export default ProductFilters;
