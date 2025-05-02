import React from "react";
import { Tabs, theme } from "antd";

const CategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { token } = theme.useToken();

  return (
    <Tabs
      type="card"
      activeKey={selectedCategory}
      onChange={onSelectCategory}
      items={categories.map((category) => ({
        key: category.id,
        label: category.name,
      }))}
      size="middle"
      tabBarStyle={{
        marginBottom: token.marginXS, // Using Ant Design's token system
      }}
      tabBarGutter={token.marginSM} // Adding standardized spacing between tabs
    />
  );
};

export default CategorySelector;