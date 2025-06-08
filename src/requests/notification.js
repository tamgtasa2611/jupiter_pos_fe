import api from "@utils/request";

export const getNotifications = async () => {
  try {
    const notifications = await api.get(`/notifications/search`);
    return notifications; 
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
};

export const getStreams = async () => {
  try {
    const notifications = await api.get(`/notifications/stream`);
    return notifications; 
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
};