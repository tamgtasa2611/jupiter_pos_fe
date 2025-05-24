import "@ant-design/v5-patch-for-react-19";
import ProductDetailPage from "@components/admin/hang-hoa/chi-tiet/ProductDetailPage";

import { getAllIds } from "@/requests/product";

export async function generateStaticParams() {
  try {
    const ids = await getAllIds();
    return ids.map((id) => ({ id: String(id) }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default function Page() {
  return <ProductDetailPage />;
}
