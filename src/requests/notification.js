import api from "@utils/request";

export const getNotifications = async () => {
  try {
    const res = await api.get(`/notifications/search`);
    // Assuming your backend returns the array of IDs in res.data
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    // Return an empty array as default
    return { data: [] };
  }
};

