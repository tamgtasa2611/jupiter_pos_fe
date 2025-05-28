import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const FloatingActionButton = ({ setAddModalVisible, isMobile }) => {
  return (
    <Button
      type="primary"
      shape="circle"
      onClick={() => setAddModalVisible(true)}
      icon={<PlusOutlined />}
      style={{
        zIndex: 2,
        position: "fixed",
        bottom: "80px",
        width: "48px",
        height: "48px",
        display: isMobile ? "block" : "none",
      }}
      className="right-4 shadow-sm"
    />
  );
};

export default FloatingActionButton;
