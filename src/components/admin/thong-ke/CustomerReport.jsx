import { Flex } from "antd";
import TopDebtCustomer from "../trang-chu/TopDebtCustomer";
import Top10Customers from "../trang-chu/Top10Customers";

export default function CustomerReport() {
  console.log("CustomerReport component rendered");
  return (
    <Flex gap="large" vertical>
      <Top10Customers />
      <TopDebtCustomer />
    </Flex>
  );
}
