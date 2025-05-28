import React from "react";
import { Button, Flex, Dropdown } from "antd";
import {
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const ProductActionBar = ({
  setAddModalVisible,
  setImportModalVisible,
  ProductFilters,
  filterProps,
  loading,
  onRefresh,
}) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      wrap="wrap"
      gap={16}
      className="mb-6"
    >
      {/* Search and filters */}
      <ProductFilters {...filterProps} />

      {/* Action buttons */}
      <Flex gap={8} wrap="wrap">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddModalVisible(true)}
        >
          Thêm sản phẩm
        </Button>

        <Button
          icon={<ImportOutlined />}
          onClick={() => setImportModalVisible(true)}
        >
          Nhập từ Excel
        </Button>

        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <FileExcelOutlined />,
                label: "Xuất Excel",
              },
              {
                key: "2",
                icon: <FilePdfOutlined />,
                label: "Xuất PDF",
              },
              {
                key: "3",
                icon: <PrinterOutlined />,
                label: "In danh sách",
              },
            ],
          }}
        >
          <Button icon={<ExportOutlined />}>
            Xuất
            <svg className="inline-block w-2 h-2 ml-1 -mt-1" viewBox="0 0 6 3">
              <polygon points="0,0 6,0 3,3" fill="currentColor" />
            </svg>
          </Button>
        </Dropdown>

        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          Tải lại
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProductActionBar;
