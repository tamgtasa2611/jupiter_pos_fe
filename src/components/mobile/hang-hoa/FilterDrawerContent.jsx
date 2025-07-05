import React from "react";
import { Flex, Select, Button } from "antd";

const { Option } = Select;
import { DANG_BAN, NGUNG_BAN } from "@/constants/product";
const FilterDrawerContent = ({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories,
  setFilterDrawerOpen,
}) => {
  return (
    <Flex vertical gap={12}>
      <Select
        placeholder="Danh mục"
        style={{ width: "100%" }}
        value={selectedCategory}
        onChange={setSelectedCategory}
        allowClear
      >
        <Option value="all">Tất cả danh mục</Option>
        {categories.map((category) => (
          <Option key={category.value} value={category.value}>
            {category.label}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Trạng thái"
        style={{ width: "100%" }}
        value={selectedStatus}
        onChange={setSelectedStatus}
        allowClear
      >
        <Option value="all">Tất cả trạng thái</Option>
        <Option value={DANG_BAN}>Đang bán</Option>
        <Option value={NGUNG_BAN}>Ngừng bán</Option>
      </Select>

      <Button type="primary" block onClick={() => setFilterDrawerOpen(false)}>
        Áp dụng
      </Button>
    </Flex>
  );
};

export default FilterDrawerContent;
