import { Flex } from "antd";

import Top10Products from "./Top10Products";
import ProductLowInventory from "./ProductLowInventory";
import ProductDeadStock from "./ProductDeadStock";
import TopLowStockProduct from "./TopLowStockProduct";

export default function ProductReport() {
  return (
    <Flex gap="large" vertical style={{ margin: "0 auto", width: "100%" }}>
      <Top10Products/>
      <TopLowStockProduct/>
      
      <Flex gap="large">
        <ProductLowInventory style={{ flex: 1, minWidth: 250 }} />
        <ProductDeadStock style={{ flex: 1, minWidth: 250 }} />
      </Flex>
    </Flex>
  );
}