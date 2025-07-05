"use client";

import LoginPage from "@components/common/login/LoginPage";
import MobileLoginPage from "@components/common/login/MobileLoginPage";
import useIsMobile from "@utils/useIsMobile";

export default function Page() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileLoginPage /> : <LoginPage />; 
}
