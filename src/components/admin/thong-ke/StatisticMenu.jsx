"use client";

import React from "react";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
	{
		key: "/admin/thong-ke/ban-hang",
		label: <Link href="/admin/thong-ke/ban-hang">Bán hàng</Link>,
	},
	{
		key: "/admin/thong-ke/hang-hoa",
		label: <Link href="/admin/thong-ke/hang-hoa">Hàng hóa</Link>,
	},
	{
		key: "/admin/thong-ke/khach-hang",
		label: <Link href="/admin/thong-ke/khach-hang">Khách hàng</Link>,
	},
	{
		key: "/admin/thong-ke/don-hang",
		label: <Link href="/admin/thong-ke/don-hang">Đơn hàng</Link>,
	},
	{
		key: "/admin/thong-ke/nhan-vien",
		label: <Link href="/admin/thong-ke/nhan-vien">Nhân viên</Link>,
	},
];

const StatisticMenu = () => {
	const pathname = usePathname();
	return (
		<Menu
			mode="inline"
			selectedKeys={[pathname]}
			style={{ height: "100%", borderRight: 0 }}
			items={menuItems}
		/>
	);
};

export default StatisticMenu;