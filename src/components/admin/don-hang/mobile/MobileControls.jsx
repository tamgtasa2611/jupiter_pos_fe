import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import MobileHeader from "./MobileHeader";

const MobileControls = ({ searchText, onSearch }) => {
  return (
    <>
      <MobileHeader searchText={searchText} onSearch={onSearch} />

      <Link href="/admin/ban-hang">
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          className="right-4 shadow-sm"
          style={{
            zIndex: 2,
            position: "fixed",
            bottom: "80px",
            width: "48px",
            height: "48px",
            display: "block",
          }}
        />
      </Link>
    </>
  );
};

export default MobileControls;
