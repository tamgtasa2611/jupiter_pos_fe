import React from "react";
import OrderTable from "./OrderTable";
import MobileOrderList from "./mobile/MobileOrderList";

const OrderContent = ({
  isMobile,
  orders,
  loading,
  pagination,
  hasMore,
  onTableChange,
  onLoadMore,
  onShowDetails,
}) => {
  return isMobile ? (
    <MobileOrderList
      orders={orders}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      onShowDetails={onShowDetails}
    />
  ) : (
    <OrderTable
      orders={orders}
      loading={loading}
      pagination={pagination}
      onTableChange={onTableChange}
      onShowDetails={onShowDetails}
    />
  );
};

export default OrderContent;
