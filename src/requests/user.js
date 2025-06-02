import api from "@utils/request";

export const fetchUsers = async () => {
  try {
    const users = await api.get("/users");
    return users;
  } catch (error) {
    console.error("Lỗi khi lấy users:", error);
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
