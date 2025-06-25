"use client";
import EmployeePage from "@components/admin/nhan-vien/EmployeePage";
import AdminRoute from "@components/admin/common/AdminRoute";

import React from "react";

export default function Page() {
  return (
    <AdminRoute>
      <EmployeePage />
    </AdminRoute>
  );
}
