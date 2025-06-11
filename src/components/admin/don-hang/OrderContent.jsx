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
  setSelectedOrderId,
  setViewModalVisible,
}) => {
  return isMobile ? (
    <MobileOrderList
      orders={orders}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      onShowDetails={() => {}}
    />
  ) : (
    <OrderTable
      orders={orders}
      loading={loading}
      pagination={pagination}
      onTableChange={onTableChange}
      setSelectedOrderId={setSelectedOrderId}
      setViewModalVisible={setViewModalVisible}
    />
  );
};

export default React.memo(OrderContent);
