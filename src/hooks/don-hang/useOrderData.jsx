import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import dayjs from "dayjs";

const useOrderData = () => {
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);

  // Sorting
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    position: ["bottomCenter"],
    showSizeChanger: true,
  });

  // Debounced search handler
  const debouncedSetSearchText = useCallback(
    debounce((value) => {
      setSearchText(value);
    }, 300),
    [],
  );

  const fetchOrders = useCallback(
    (isLoadingMore = false) => {
      setLoading(true);

      setTimeout(() => {
        // Mock data generation
        let mockData = Array(100)
          .fill()
          .map((_, index) => ({
            id: index + 1,
            orderId: `DH${String(index + 1).padStart(6, "0")}`,
            customerName: `Khách hàng ${index + 1}`,
            createdAt: new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
            ),
            orderDate: new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
            ).toLocaleDateString(),
            totalAmount: Math.floor(Math.random() * 5000000),
            status: [
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Refunded",
              "Cancelled",
            ][Math.floor(Math.random() * 5)],
            phone: `09${Math.floor(Math.random() * 100000000)}`,
            address: `Địa chỉ ${index + 1}, Phường X, Quận Y, TP.HN`,
            items: Math.floor(Math.random() * 10) + 1,
          }));

        // Áp dụng các bộ lọc
        if (searchText) {
          const searchTerm = searchText.toLowerCase();
          mockData = mockData.filter(
            (order) =>
              order.customerName.toLowerCase().includes(searchTerm) ||
              order.orderId.toLowerCase().includes(searchTerm) ||
              order.phone.includes(searchTerm),
          );
        }

        if (selectedStatus !== "all") {
          mockData = mockData.filter(
            (order) => order.status === selectedStatus,
          );
        }

        if (dateRange && dateRange[0] && dateRange[1]) {
          mockData = mockData.filter((order) => {
            const orderDate = dayjs(order.orderDate, "DD/MM/YYYY");
            return orderDate.isBetween(dateRange[0], dateRange[1], null, "[]");
          });
        }

        // Sắp xếp
        if (sortBy) {
          mockData.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "customerName") {
              comparison = a.customerName.localeCompare(b.customerName);
            } else if (sortBy === "orderDate") {
              comparison =
                new Date(a.orderDate).getTime() -
                new Date(b.orderDate).getTime();
            } else if (sortBy === "totalAmount") {
              comparison = a.totalAmount - b.totalAmount;
            } else if (sortBy === "status") {
              comparison = a.status.localeCompare(b.status);
            }
            return sortOrder === "ascend" ? comparison : -comparison;
          });
        }

        // Xử lý phân trang
        const pageSize = 10;
        const total = mockData.length;

        if (isLoadingMore) {
          const start = orders.length;
          const end = start + pageSize;
          const result = mockData.slice(start, end);

          setOrders((prevOrders) => [...prevOrders, ...result]);
          setHasMore(orders.length + result.length < total);
        } else {
          const result = mockData.slice(0, pageSize);
          setOrders(result);
          setHasMore(result.length < total);

          setPagination((prev) => ({
            ...prev,
            current: 1,
            total: total,
          }));
        }

        setLoading(false);
      }, 500);
    },
    [orders.length, searchText, selectedStatus, dateRange, sortBy, sortOrder],
  );

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchOrders(true);
    }
  }, [loading, hasMore, fetchOrders]);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

    if (sorter.field) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order);
    } else {
      setSortBy(null);
      setSortOrder(null);
    }
  }, []);

  const handleSearch = useCallback(
    (value) => {
      debouncedSetSearchText(value);
    },
    [debouncedSetSearchText],
  );

  const handleStatusFilter = useCallback((value) => {
    setSelectedStatus(value);
  }, []);

  const handleDateRangeChange = useCallback((dates) => {
    setDateRange(dates);
  }, []);

  // Fetch orders khi các bộ lọc hoặc sắp xếp thay đổi
  useEffect(() => {
    fetchOrders(false);
  }, [searchText, selectedStatus, sortBy, sortOrder, dateRange, fetchOrders]);

  return {
    orders,
    loading,
    hasMore,
    searchText,
    selectedStatus,
    dateRange,
    pagination,
    handleSearch,
    handleStatusFilter,
    handleDateRangeChange,
    handleLoadMore,
    handleTableChange,
  };
};

export default useOrderData;
