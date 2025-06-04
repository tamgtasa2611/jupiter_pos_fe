import api from "@utils/request";

export const getOrders = async (params = {}) => {
  try {
    const res = await api.post(`/orders/search`, params);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy đơn vị:", error);
    // Return an empty array as default
    throw error;
  }
};

export const createOrder = async (data) => {
  try {
    const res = await api.post("/orders/create", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return [];
  }
};
