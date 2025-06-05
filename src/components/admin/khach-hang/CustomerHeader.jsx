import { Typography, Flex } from "antd";
const { Title } = Typography;

const CustomerHeader = () => {
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
          Khách hàng
        </Title>
      </div>
    </Flex>
  );
};

export default CustomerHeader;
