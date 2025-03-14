import { Flex } from "antd";
import SalesSummary from "./SalesSummary";
import TodaySummary from "./TodaySummary";
import Top10Products from "./Top10Products";
import Top10Customers from "./Top10Customers";

export default function AdminDashboard() {
  return (
    <Flex gap="large" vertical>
      <TodaySummary />
      <SalesSummary />
      <Flex gap="large" justify="space-between" className="flex flex-col md:flex-row">
        <Top10Products />
        <Top10Customers />
      </Flex>
    </Flex>
  );
}
