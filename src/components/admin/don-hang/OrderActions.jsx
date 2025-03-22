import React from "react";
import { Flex, Button, Dropdown } from "antd";
import {
  PlusOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const OrderActions = ({ onExport }) => {
  return (
    <Flex gap={8} wrap="wrap">
      <Link href="/admin/ban-hang">
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm đơn hàng
        </Button>
      </Link>

      <Dropdown
        menu={{
          items: [
            {
              key: "1",
              icon: <FileExcelOutlined />,
              label: "Xuất Excel",
              onClick: () => onExport("excel"),
            },
            {
              key: "2",
              icon: <FilePdfOutlined />,
              label: "Xuất PDF",
              onClick: () => onExport("pdf"),
            },
            {
              key: "3",
              icon: <PrinterOutlined />,
              label: "In danh sách",
              onClick: () => onExport("print"),
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
    </Flex>
  );
};

export default OrderActions;
