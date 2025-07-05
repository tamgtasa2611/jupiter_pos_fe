import React, { memo } from "react";
import { Tabs, theme } from "antd";

const CategorySelector = memo(
  ({ categories, selectedCategory, onSelectCategory }) => {
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
          marginBottom: token.marginXS,
        }}
        tabBarGutter={token.marginSM}
      />
    );
  },
);

CategorySelector.displayName = "CategorySelector";

export default CategorySelector;
