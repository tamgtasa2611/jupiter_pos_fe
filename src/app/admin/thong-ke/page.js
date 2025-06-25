"use client";

import MainStatisticsPage from "@components/admin/thong-ke/MainStatisticsPage";
import AdminRoute from "@components/admin/common/AdminRoute";

export default function Page() {
  return (
    <AdminRoute>
      <MainStatisticsPage />
    </AdminRoute>
  );
}
