import { Flex } from "antd";
import SalesSummary from "./SalesSummary";
import TodaySummary from "./TodaySummary";
import Top10Products from "../thong-ke/hang-hoa/Top10Products";
import Top10Customers from "../thong-ke/khach-hang/Top10Customers";
import OrderStatusReport from "./OrderStatusReport";

export default function AdminDashboard() {
  return (
    <Flex gap="large" vertical>
      <TodaySummary />
      <SalesSummary />
      <Flex
        gap="large"
        justify="space-between"
        className="flex flex-col md:flex-row"
      >
        <Top10Products style={{ flex: 1 }} />
        <OrderStatusReport style={{ flex: 1 }} />
      </Flex>
      <Top10Customers />
    </Flex>
  );
}
