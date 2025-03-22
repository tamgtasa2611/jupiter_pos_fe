import React from "react";
import { Menu } from "antd";
import {
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

const MobileMenu = ({ setAddModalVisible, setImportModalVisible }) => {
  return (
    <Menu>
      <Menu.Item key="add" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
        Thêm sản phẩm
      </Menu.Item>
      <Menu.Item key="import" icon={<ImportOutlined />} onClick={() => setImportModalVisible(true)}>
        Nhập từ Excel
      </Menu.Item>
      <Menu.Divider />
      <Menu.SubMenu key="export" icon={<ExportOutlined />} title="Xuất">
        <Menu.Item key="excel" icon={<FileExcelOutlined />}>
          Xuất Excel
        </Menu.Item>
        <Menu.Item key="pdf" icon={<FilePdfOutlined />}>
          Xuất PDF
        </Menu.Item>
        <Menu.Item key="print" icon={<PrinterOutlined />}>
          In danh sách
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default MobileMenu;
