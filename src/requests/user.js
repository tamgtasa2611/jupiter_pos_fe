import api from "@utils/request";

export const fetchUsers = async () => {
  try {
    const users = await api.get("/users");
    console.log(users);
    return users;
  } catch (error) {
    console.error("Lỗi khi lấy users:", error);
    return [];
  }
};


