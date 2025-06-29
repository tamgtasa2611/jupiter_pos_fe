import { Flex } from "antd";
import SalesSummary from "./SalesSummary";
import TodaySummary from "./TodaySummary";
import Top10Products from "./Top10Products";
import Top10Customers from "../thong-ke/khach-hang/Top10Customers";

export default function AdminDashboard() {
  return (
    <Flex gap="large" vertical>
      <TodaySummary />
      <SalesSummary />
      <Flex
        gap="large"
        justify="space-between"
        className="flex flex-col md:flex-row"
      ></Flex>
      <Top10Products />
      <Top10Customers />
    </Flex>
  );
}
