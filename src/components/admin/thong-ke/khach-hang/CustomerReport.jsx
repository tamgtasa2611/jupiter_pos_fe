import { Flex } from "antd";
import TopDebtCustomer from "./TopDebtCustomer";
import Top10Customers from "./Top10Customers";
import InactiveCustomers from "./InactiveCustomers";

export default function CustomerReport() {
  console.log("CustomerReport component rendered");
  return (
    <Flex gap="large" vertical>
      <Top10Customers />
      <TopDebtCustomer />
      <InactiveCustomers />
    </Flex>
  );
}
