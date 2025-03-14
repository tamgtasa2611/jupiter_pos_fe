import { Flex } from "antd";
import SalesSummary from "./SalesSummary";
import TodaySummary from "./TodaySummary";
import Top10Products from "./Top10Products";

export default function AdminDashboard() {
  return (
    <Flex gap="large" vertical>
      <TodaySummary />
      <SalesSummary />
      <Flex gap="large" justify="space-between">
        <Top10Products />
        <Top10Products />
      </Flex>
    </Flex>
  );
}
