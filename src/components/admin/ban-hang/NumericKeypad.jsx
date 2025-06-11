import React, { useState, memo } from "react";
import { Modal, Button, Input, Row, Col, Typography, Space } from "antd";

const { Title } = Typography;

const NumericKeypad = memo(
  ({ visible, onCancel, onConfirm, title, initialValue = "" }) => {
    const [value, setValue] = useState(initialValue);

    const handleButtonClick = (digit) => {
      setValue((prev) => prev + digit);
    };

    const handleBackspace = () => {
      setValue((prev) => prev.slice(0, -1));
    };

    const handleClear = () => {
      setValue("");
    };

    const handleConfirm = () => {
      onConfirm(value);
      setValue("");
    };

    const keypadButtons = [
      "7",
      "8",
      "9",
      "4",
      "5",
      "6",
      "1",
      "2",
      "3",
      "0",
      "00",
      ".",
    ];

    if (!visible) return null;

    return (
      <Modal
        title={<Title level={4}>{title || "Nhập số"}</Title>}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={400}
        centered
        maskClosable={false}
        styles={{
          wrapper: { animation: "none" },
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input
            value={value}
            size="large"
            style={{
              textAlign: "right",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
            readOnly
          />

          <Row gutter={[12, 12]}>
            {keypadButtons.map((digit) => (
              <Col span={8} key={digit}>
                <Button
                  type="default"
                  size="large"
                  block
                  style={{ height: "64px", fontSize: "20px" }}
                  onClick={() => handleButtonClick(digit)}
                >
                  {digit}
                </Button>
              </Col>
            ))}
          </Row>

          <Row gutter={[12, 12]}>
            <Col span={8}>
              <Button
                type="default"
                size="large"
                block
                style={{ height: "64px", fontSize: "20px" }}
                onClick={handleClear}
                danger
              >
                Xóa
              </Button>
            </Col>
            <Col span={8}>
              <Button
                type="default"
                size="large"
                block
                style={{ height: "64px", fontSize: "20px" }}
                onClick={handleBackspace}
              />
            </Col>
            <Col span={8}>
              <Button
                type="primary"
                size="large"
                block
                style={{ height: "64px", fontSize: "20px" }}
                onClick={handleConfirm}
                disabled={!value}
              >
                OK
              </Button>
            </Col>
          </Row>
        </Space>
      </Modal>
    );
  },
);

NumericKeypad.displayName = "NumericKeypad";

export default NumericKeypad;
