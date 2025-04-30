import React from "react";
import { Drawer, Menu } from "antd";
import {
  PlusOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

const MobileMenuDrawer = ({ open, onClose, onExport }) => {
  return (
    <Drawer
      title="Menu"
      placement="left"
      open={open}
      onClose={onClose}
      width={280}
    >
      <Menu>
        <Menu.Divider />
        <Menu.SubMenu key="export" icon={<ExportOutlined />} title="Xuất">
          <Menu.Item
            key="excel"
            icon={<FileExcelOutlined />}
            onClick={() => onExport("excel")}
          >
            Xuất Excel
          </Menu.Item>
          <Menu.Item
            key="pdf"
            icon={<FilePdfOutlined />}
            onClick={() => onExport("pdf")}
          >
            Xuất PDF
          </Menu.Item>
          <Menu.Item
            key="print"
            icon={<PrinterOutlined />}
            onClick={() => onExport("print")}
          >
            In danh sách
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Drawer>
  );
};

export default MobileMenuDrawer;
