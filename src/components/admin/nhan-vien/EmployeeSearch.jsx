import React, { useState, useEffect, useCallback } from "react";
import { Input, Row, Col, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const EmployeeSearch = ({
  searchText,
  setSearchText,
  setAddModalVisible,
  form,
}) => {
  // Debounce the search function
  const debouncedSetSearchText = useCallback(
    (value) => {
      const timer = setTimeout(() => {
        setSearchText(value);
      }, 300); // Adjust the debounce delay as needed (e.g., 300ms)

      return () => clearTimeout(timer);
    },
    [setSearchText],
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    debouncedSetSearchText(value);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Row gutter={16} align="middle">
        <Col xs={24} sm={16} md={18}>
          <Input
            placeholder="Tìm kiếm theo tên, mã, vị trí, phòng ban..."
            prefix={<SearchOutlined />}
            defaultValue={searchText}
            onChange={handleInputChange}
            allowClear
          />
        </Col>
        <Col xs={24} sm={8} md={6} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setAddModalVisible(true);
            }}
          >
            Thêm nhân viên
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeSearch;
