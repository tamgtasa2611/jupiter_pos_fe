import React from "react";
import { Flex, Typography } from "antd";

const { Title } = Typography;

const EmployeeHeader = () => {
  return (
    <Flex
      justify="space-between"
      align="center"
      wrap="wrap"
      style={{ marginBottom: 16 }}
      className="h-auto"
    >
      <div>
        <Title level={4} style={{ margin: 0 }}>
          Nhân viên
        </Title>
      </div>
    </Flex>
  );
};

export default EmployeeHeader;
