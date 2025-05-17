import "@ant-design/v5-patch-for-react-19";
import ProductDetailPage from "@components/admin/hang-hoa/chi-tiet/ProductDetailPage";

// Thêm hàm này để Next.js biết build những id nào
export function generateStaticParams() {
  // Fake 3 sản phẩm mẫu, bạn có thể lấy từ API hoặc file tĩnh
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
    { id: "8" },
    { id: "9" },
    { id: "10" },
    { id: "11" },
    { id: "12" },
    { id: "13" },
    { id: "14" },
    { id: "15" },
    { id: "16" },
    { id: "17" },
    { id: "18" },
    { id: "19" },
    { id: "20" },
    { id: "21" },
    { id: "22" },
    { id: "23" },
    { id: "24" },
    { id: "25" },
    { id: "26" },
    { id: "27" },
    { id: "28" },
    { id: "29" },
    { id: "30" },
  ];
}

export default function Page() {
  return <ProductDetailPage />;
}
