import React from "react";
import { Flex, Typography } from "antd";

const { Title } = Typography;

const OrderHeader = ({ isMobile, setMenuDrawerOpen, setFilterDrawerOpen }) => {
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
          Đơn hàng
        </Title>
      </div>
    </Flex>
  );
};

export default React.memo(OrderHeader);
