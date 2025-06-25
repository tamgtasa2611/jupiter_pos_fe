"use client";

import { Avatar, Dropdown } from "antd";
import { searchUser } from "@/requests/user";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getUserFromToken } from "@/utils/utils";
import Link from "next/link";

/*
Hồ sơ cá nhân (Profile)

Xem và cập nhật tên, email, avatar, số điện thoại.

Hiển thị vai trò (quyền) trong hệ thống.

Cài đặt tài khoản (Account Settings)

Đổi mật khẩu.

Thiết lập bảo mật (email khôi phục, xác thực 2 bước nếu có).

Đổi ngôn ngữ giao diện.

Đăng xuất (Logout)

Thoát khỏi phiên làm việc.

*/

const UserProfile = ({ scrolled, onLogout }) => {
  const user = getUserFromToken();
  const fullName = user?.fullName || "-";
  const email = user?.email || null;
  const phone = user?.phone || null;

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "/admin/tai-khoan",
            icon: <UserOutlined />,
            label: <Link href="/admin/tai-khoan">Hồ sơ cá nhân</Link>,
          },
          { type: "divider" },
          {
            key: "2",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            onClick: () => onLogout(),
            className: "text-red-500",
          },
        ],
      }}
      placement="bottomRight"
      trigger={["click"]}
      overlayClassName="w-56"
      popupRender={(menu) => (
        <div className="bg-white rounded-xl drop-shadow-md border border-gray-100 overflow-hidden animate-fadeIn">
          <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
            <Avatar
              size="large"
              className="border-2 border-blue-400"
              icon={<UserOutlined />}
              style={{
                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
              }}
            />
            <div>
              <div className="font-semibold">{fullName}</div>
              <div className="text-xs text-gray-500">
                {email ? email : phone ? phone : "-"}
              </div>
            </div>
          </div>
          {menu}
        </div>
      )}
    >
      <div className="cursor-pointer flex items-center ml-3 hover:bg-gray-50/30 p-0.5 rounded-full transition-all duration-300">
        <Avatar
          className="border-2 border-white shadow-sm"
          size={38}
          icon={<UserOutlined />}
          style={{
            boxShadow: scrolled ? "0 0 0 2px rgba(59, 130, 246, 0.3)" : "none",
            transition: "all 0.3s ease",
          }}
        />
      </div>
    </Dropdown>
  );
};

export default UserProfile;
