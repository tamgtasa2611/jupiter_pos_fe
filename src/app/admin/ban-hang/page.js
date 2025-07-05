"use client";

import useIsMobile from "@utils/useIsMobile";
import MainSellingPage from "@components/admin/ban-hang/MainSellingPage";
import MobileMainSellingPage from "@components/mobile/ban-hang/MobileMainSellingPage";

export default function Page() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileMainSellingPage /> : <MainSellingPage />;
}
