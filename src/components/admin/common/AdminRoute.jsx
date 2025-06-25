"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/utils/utils";
import { ADMIN } from "@/constants/user";
import { Spin } from "antd";

const AdminRoute = ({ children }) => {
  const router = useRouter();
  const user = getUserFromToken();
  const role = user?.role;

  useEffect(() => {
    if (role !== ADMIN) {
      router.back();
    }
  }, [role, router]);

  if (role !== ADMIN) {
    return <Spin />;
  }

  return children;
};

export default AdminRoute;
