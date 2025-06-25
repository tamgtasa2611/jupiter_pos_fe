import React, { useState, memo, useEffect, useRef } from "react";
import { Modal, Button, Input, Row, Col, Typography, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const NumericKeypad = memo(
  ({ visible, onCancel, onConfirm, title, initialValue = "" }) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef(null);

    useEffect(() => {
      if (visible && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    }, [visible]);

    useEffect(() => {
      if (!visible) {
        setValue("");
      }
    }, [visible]);

    const handleInputChange = (e) => {
      const inputValue = e.target.value;

      const numericValue = inputValue.replace(/[^0-9]/g, "");
      setValue(numericValue);
    };

    const handleKeyDown = (e) => {
      e.preventDefault();

      const { key } = e;

      if (key >= "0" && key <= "9") {
        // Số từ 0-9
        handleButtonClick(key);
      } else if (key === "Backspace") {
        // Phím xóa
        handleBackspace();
      } else if (key === "Delete") {
        // Phím Delete - xóa tất cả
        handleClear();
      } else if (key === "Enter") {
        // Phím Enter - xác nhận
        handleConfirm();
      } else if (key === "Escape") {
        // Phím Esc - hủy
        onCancel();
      }
    };

    const handleButtonClick = (digit) => {
      setValue((prev) => {
        const prevStr = String(prev || "");

        if (prevStr === "0" && digit !== "0") {
          return digit;
        }
        if (prevStr === "0" && digit === "0") {
          return "0";
        }
        return prevStr + digit;
      });
    };

    const handleBackspace = () => {
      setValue((prev) => {
        const prevStr = String(prev || "");
        const newValue = prevStr.slice(0, -1);
        return newValue || "";
      });
    };

    const handleClear = () => {
      setValue("");
    };

    const handleConfirm = () => {
      const valueStr = String(value || "");
      if (!valueStr || isNaN(valueStr) || valueStr.trim() === "") {
        onConfirm(0);
      } else {
        onConfirm(parseInt(valueStr) || 0);
      }
      setValue("");
    };

    const formatDisplayValue = (val) => {
      if (!val) return "";
      return String(val);
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
      "000",
    ];

    if (!visible) return null;

    return (
      <Modal
        title={<Title level={4}>{title}</Title>}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={480}
        centered
        maskClosable={false}
        styles={{
          wrapper: { animation: "none" },
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Input
            ref={inputRef}
            value={formatDisplayValue(value)}
            size="large"
            placeholder="0"
            style={{
              textAlign: "right",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            suffix="sản phẩm"
          />

          <Row gutter={[12, 12]}>
            {keypadButtons.map((digit) => (
              <Col span={8} key={digit}>
                <Button
                  type="default"
                  size="large"
                  block
                  style={{
                    height: "64px",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
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
                style={{
                  height: "64px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
                onClick={handleClear}
                danger
              >
                Xóa hết
              </Button>
            </Col>
            <Col span={8}>
              <Button
                type="default"
                size="large"
                block
                icon={<DeleteOutlined />}
                style={{
                  height: "64px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
                onClick={handleBackspace}
              >
                Xóa
              </Button>
            </Col>
            <Col span={8}>
              <Button
                type="primary"
                size="large"
                block
                style={{
                  height: "64px",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
                onClick={handleConfirm}
              >
                Xác nhận
              </Button>
            </Col>
          </Row>

          <div
            style={{
              fontSize: "12px",
              color: "#999",
              textAlign: "center",
              borderTop: "1px solid #f0f0f0",
              paddingTop: "8px",
            }}
          >
            Phím tắt: Enter (Xác nhận) • Backspace (Xóa) • Delete (Xóa hết) •
            Esc (Hủy)
          </div>
        </Space>
      </Modal>
    );
  },
);

NumericKeypad.displayName = "NumericKeypad";

export default NumericKeypad;
