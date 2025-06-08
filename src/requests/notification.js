import api from "@utils/request";

export const getNotifications = async (page) => {
  try {
    const notifications = await api.get(`/notifications/search`, {
      params : { page }
    });
    return notifications; 
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    return [];
  }
};