import React, { useEffect, useRef } from "react";
import { List, Flex, Tag, Typography, Divider, Spin, Empty } from "antd";
import dayjs from "dayjs";
import {
  LoadingOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const OrderList = ({ orders, loading, hasMore, onLoadMore, onShowDetails }) => {
  const listRef = useRef(null);

  // Prepare the list with date headers
  const prepareListItems = () => {
    if (!orders || orders.length === 0) return [];

    // Group orders by date
    const ordersByDate = {};

    orders.forEach((order) => {
      const orderDate = dayjs(order.createdAt).format("YYYY-MM-DD");

      if (!ordersByDate[orderDate]) {
        ordersByDate[orderDate] = [];
      }

      ordersByDate[orderDate].push(order);
    });

    // Get dates and sort them in descending order (newest first)
    const sortedDates = Object.keys(ordersByDate).sort((a, b) => {
      return dayjs(b).diff(dayjs(a));
    });

    // Build the final list with date headers followed by their orders
    const result = [];

    sortedDates.forEach((date) => {
      const ordersForDate = ordersByDate[date];
      const orderCount = ordersForDate.length;

      // Add date header
      result.push({
        id: `date-header-${date}`,
        isDateHeader: true,
        date: date,
        formattedDate: dayjs(date).format("DD/MM/YYYY"),
        orderCount: orderCount,
      });

      // Add all orders for this date
      result.push(...ordersByDate[date]);
    });

    return result;
  };

  // Handle scroll event for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollElement = document.querySelector(".order-list");
      if (!scrollElement) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollElement;

      // If scrolled to near bottom (within 200px of bottom), load more
      if (scrollHeight - scrollTop - clientHeight < 200) {
        onLoadMore();
      }
    };

    const scrollElement = document.querySelector(".order-list");
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore, onLoadMore]);

  const listItems = prepareListItems();

  // LoadMore component at the bottom
  const loadMore = (
    <div
      style={{
        textAlign: "center",
        margin: "12px 0",
        height: 32,
        lineHeight: "32px",
      }}
    >
      {hasMore ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      ) : (
        listItems.length > 0 && <span>Đã hiển thị tất cả đơn hàng</span>
      )}
    </div>
  );

  return (
    <List
      ref={listRef}
      loading={loading && orders.length === 0}
      itemLayout="horizontal"
      dataSource={listItems}
      loadMore={loadMore}
      locale={{ emptyText: <Empty description="Không có đơn hàng nào" /> }}
      className="order-list"
      style={{
        maxHeight: "70vh",
        overflow: "auto",
        padding: "0 4px",
      }}
      renderItem={(item, index) => {
        if (item.isDateHeader) {
          return (
            <List.Item
              style={{ padding: "16px 0 8px" }}
              className={`${index > 0 ? "mt-4" : ""} date-head`}
            >
              <div style={{ margin: "0 0 4px" }} className="w-full">
                <div className="text-gray-500 font-medium w-full">
                  {item.formattedDate === dayjs().format("DD/MM/YYYY") ? (
                    <Flex
                      justify="space-between"
                      align="center"
                      className="w-full"
                    >
                      <div>Hôm nay</div>
                      <div>{item.orderCount} đơn hàng</div>
                    </Flex>
                  ) : (
                    <Flex
                      justify="space-between"
                      align="center"
                      className="w-full"
                    >
                      <div> {item.formattedDate}</div>
                      <div>{item.orderCount} đơn hàng</div>
                    </Flex>
                  )}
                </div>
              </div>
            </List.Item>
          );
        }

        // Regular order item rendering
        const orderTime = dayjs(item.createdAt).format("HH:mm");

        return (
          <List.Item onClick={() => onShowDetails(item)}>
            <Flex className="w-full" align="center">
              <Flex vertical style={{ flex: 1 }} gap="small">
                <Flex justify="space-between" align="center">
                  <Flex align="center" gap="small">
                    <Title level={5} style={{ margin: 0 }}>
                      #{item.orderId}
                    </Title>
                    <Text type="secondary" style={{ fontSize: "13px" }}>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {orderTime}
                    </Text>
                  </Flex>
                  <Tag
                    color={
                      item.status === "Delivered"
                        ? "success"
                        : item.status === "Shipped"
                          ? "processing"
                          : item.status === "Processing"
                            ? "warning"
                            : item.status === "Pending"
                              ? "purple"
                              : "error"
                    }
                    style={{
                      marginInlineEnd: "0",
                    }}
                  >
                    {item.status}
                  </Tag>
                </Flex>
                <Flex vertical gap="small">
                  <div
                    type="secondary"
                    strong
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <UserOutlined style={{ marginRight: 6 }} />{" "}
                    {item.customerName}
                  </div>
                  <Flex justify="space-between" align="center">
                    <div
                      className="font-semibold text-blue-600"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <ShoppingOutlined style={{ marginRight: 6 }} />
                      {item.items} sản phẩm
                    </div>
                    <div className="font-medium text-green-600">
                      {new Intl.NumberFormat("vi-VN").format(item.totalAmount) +
                        "₫"}
                    </div>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </List.Item>
        );
      }}
    />
  );
};

export default OrderList;
