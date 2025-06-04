import React from "react";
import { Flex, Button, Dropdown } from "antd";
import {
  PlusOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const OrderActions = ({ onExport, onReload }) => {
  return (
    <Flex gap={8} wrap="wrap">
      <Link href="/admin/ban-hang">
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm đơn hàng
        </Button>
      </Link>
      <Button
        type="default"
        onClick={onReload}
        icon={<ReloadOutlined />}
      ></Button>
    </Flex>
  );
};

export default OrderActions;
