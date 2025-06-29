import { Flex } from "antd";

import Top10Products from "./Top10Products";
import ProductLowStock from "./ProductLowStock";

export default function ProductReport() {
  return (
    <Flex gap="large" vertical>
      <Top10Products/>
      <ProductLowStock />
    </Flex>
  );
}