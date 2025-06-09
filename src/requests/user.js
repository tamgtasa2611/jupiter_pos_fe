import api from "@utils/request";

export const fetchUsers = async () => {
  try {
    const users = await api.get("/users");
    return users;
  } catch (error) {
    console.error("Lỗi khi lấy users: ", error);
    return [];
  }
};

export const searchUser = async (data) => {
  try {
    const user = await api.post(`/users/search`, data);
    return user;
  } catch (error) {
    console.error(`Lỗi khi lấy user với ID ${data.id}:`, error);
    return null;
  }
};

export async function generateOtp(loginInfo = {}) {
  try {
    const otp = await api.post(`/users/generate-otp`, loginInfo);
    return otp;
  } catch (error) {
    console.error(`Lỗi khi lấy OTP!`, error);
    return null;
  }
}

export const verifyOtpAndChangePws = async (data) => {
  try {
    const users = await api.put("/users/change-password", data);
    return users;
  } catch (error) {
    console.error("Lỗi khi thay đổi mật khẩu!", error);
    return [];
  }
};