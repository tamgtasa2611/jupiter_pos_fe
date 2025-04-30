"use client";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleRedirectToLogin = () => {
    router.push("/dang-nhap");
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-sky-50"
    >
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
        extra={
          <Button type="primary" onClick={handleRedirectToLogin}>
            Đăng nhập
          </Button>
        }
      />
    </div>
  );
}
