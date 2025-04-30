import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Typography,
  DatePicker,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const EmployeeSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  // Mock data for sales
  const generateMockSalesData = () => {
    const startDate = dayjs("2024-01-01");
    const endDate = dayjs("2024-03-15");
    const timeDiff = endDate.diff(startDate, "day");
    const salesRecords = [];

    for (let i = 1; i <= 20; i++) {
      const randomEmployee =
        Math.random() < 0.5 ? "Nguyễn Văn A" : "Trần Thị B";
      const employeeCode =
        randomEmployee === "Nguyễn Văn A" ? "NV001" : "NV002";
      const randomDate = startDate.add(
        Math.floor(Math.random() * timeDiff),
        "day",
      );
      const salesAmount =
        Math.floor(Math.random() * (20000000 - 10000000 + 1)) + 10000000; // Random amount between 10M and 20M
      const productsSold = Math.floor(Math.random() * (60 - 30 + 1)) + 30; // Random quantity between 30 and 60

      salesRecords.push({
        id: i,
        employeeName: randomEmployee,
        employeeCode: employeeCode,
        date: randomDate.format("YYYY-MM-DD"),
        salesAmount: salesAmount,
        productsSold: productsSold,
      });
    }

    return salesRecords;
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSalesData(generateMockSalesData());
      setLoading(false);
    }, 500);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleReload = () => {
    setDateRange(null);
    setSearchText("");
    fetchSalesData();
  };

  const columns = [
    {
      title: "Mã NV",
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm tên"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.employeeName.toLowerCase().includes(value.toLowerCase()),
      filterSearch: true,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Doanh số",
      dataIndex: "salesAmount",
      key: "salesAmount",
      render: (salesAmount) => salesAmount.toLocaleString("vi-VN") + " VNĐ",
      sorter: (a, b) => a.salesAmount - b.salesAmount,
    },
    {
      title: "Số lượng SP",
      dataIndex: "productsSold",
      key: "productsSold",
      sorter: (a, b) => a.productsSold - b.productsSold,
    },
  ];

  const filteredData = salesData.filter((item) => {
    const searchTextMatch =
      item.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.employeeCode.toLowerCase().includes(searchText.toLowerCase());

    const dateRangeMatch =
      !dateRange ||
      (dayjs(item.date).isSameOrAfter(dateRange[0], "day") &&
        dayjs(item.date).isSameOrBefore(dateRange[1], "day"));

    return searchTextMatch && dateRangeMatch;
  });

  return (
    <Card>
      <Title level={4}>Quản lý doanh số nhân viên</Title>
      <Space style={{ marginBottom: 16 }} direction="vertical" size="middle">
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã nhân viên"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <RangePicker onChange={handleDateRangeChange} value={dateRange} />
          <Button icon={<ReloadOutlined />} onClick={handleReload}>
            Reset
          </Button>
        </Space>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default EmployeeSales;
