"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, Button, message, Flex } from "antd";
import { UserOutlined, ReloadOutlined } from "@ant-design/icons";
import AddCustomerModal from "./AddCustomerModal";
import ViewCustomerModal from "./ViewCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import DeleteCustomerModal from "./DeleteCustomerModal";
import CustomerHeader from "./CustomerHeader";
import { getCustomers } from "@/requests/customer";
import SearchBar from "./SearchBar";
import CustomerTable from "./CustomerTable";

const CustomersMainPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("lastModifiedDate");
  const [sortDirection, setSortDirection] = useState("descend");
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
  });

  const fetchCustomers = async (
    tarPage = 0,
    tarSize = pagination.pageSize,
    searchValue = searchText,
    sortField = sortBy,
    sortOrder = sortDirection,
  ) => {
    setLoading(true);
    try {
      const page = tarPage;
      const size = tarSize;

      const sortDirection = sortOrder === "ascend" ? "ASC" : "DESC";

      const params = {
        page,
        size,
        search: searchValue || undefined,
        sortBy: sortField,
        sortDirection: sortDirection,
      };

      const response = await getCustomers(params);
      setCustomers(response.content || []);
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements || 0,
      }));
    } catch (error) {
      const errMsg =
        (error.response && error.response.message) ||
        error.message ||
        "Lỗi không xác định";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchText(trimmedValue);
    setPagination((prev) => ({ ...prev, current: 0 }));
    fetchCustomers(0, pagination.pageSize, trimmedValue);
  };

  const handleTableChange = (tablePagination, filters, sorter) => {
    const currentPage = tablePagination.current - 1;
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageSize: tablePagination.pageSize,
    }));
    if (sorter.field) {
      setSortBy(sorter.field);
      setSortDirection(sorter.order);
      fetchCustomers(
        currentPage,
        tablePagination.pageSize,
        searchText,
        sorter.field,
        sorter.order,
      );
    } else {
      fetchCustomers(currentPage, tablePagination.pageSize, searchText);
    }
  };

  const handleAddCustomer = (newCustomer) => {
    console.log("Thêm khách hàng:", newCustomer);
    setAddModalVisible(false);
    fetchCustomers();
  };

  const handleEditCustomer = (updatedCustomer) => {
    console.log("Cập nhật khách hàng:", updatedCustomer);
    setEditModalVisible(false);
    fetchCustomers();
  };

  const handleDeleteCustomer = (id) => {
    console.log("Xóa khách hàng với ID:", id);
    setDeleteModalVisible(false);
    fetchCustomers();
  };

  return (
    <div>
      <Card className="transition-shadow h-fit-screen">
        <CustomerHeader />
        <Flex
          gap={16}
          vertical
          justify="space-between"
          style={{ height: "100%" }}
        >
          <Flex gap={8} justify="space-between" align="center">
            <SearchBar
              onSearch={handleSearch}
              loading={loading}
              searchText={searchText}
              setSearchText={setSearchText}
              isMobile={false}
            />
            <Flex gap={8}>
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => setAddModalVisible(true)}
              >
                Thêm khách hàng
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchCustomers()}
                loading={loading}
              ></Button>
            </Flex>
          </Flex>

          {/* Bảng danh sách khách hàng */}
          <CustomerTable
            customers={customers}
            loading={loading}
            handleTableChange={handleTableChange}
            setViewModalVisible={setViewModalVisible}
            setSelectedCustomer={setSelectedCustomer}
            setEditModalVisible={setEditModalVisible}
            setDeleteModalVisible={setDeleteModalVisible}
            paginationConfig={{
              current: pagination.current + 1, // chuyển đổi 0-index sang 1-index cho Table
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
            }}
          />

          {/* Các modal xử lý */}
          <AddCustomerModal
            visible={addModalVisible}
            onCancel={() => setAddModalVisible(false)}
            onAdd={handleAddCustomer}
          />

          {selectedCustomer && (
            <>
              <ViewCustomerModal
                visible={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                customerId={selectedCustomer.id}
              />

              <EditCustomerModal
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onEdit={handleEditCustomer}
                customerId={selectedCustomer.id}
              />
              <DeleteCustomerModal
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onDelete={() => handleDeleteCustomer(selectedCustomer.id)}
                customer={selectedCustomer}
              />
            </>
          )}
        </Flex>
      </Card>
    </div>
  );
};

export default React.memo(CustomersMainPage);
