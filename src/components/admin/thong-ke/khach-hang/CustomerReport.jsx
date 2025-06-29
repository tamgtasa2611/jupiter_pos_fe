import { Flex } from "antd";
import TopDebtCustomer from "./TopDebtCustomer";
import Top10Customers from "./Top10Customers";
import InactiveCustomers from "./InactiveCustomers";
import NewCustomers from "./NewCustomers";

export default function CustomerReport() {
  return (
    <Flex gap="large" vertical>
      <NewCustomers />
      <Top10Customers />
      <TopDebtCustomer />
      <InactiveCustomers />
    </Flex>
  );
}
