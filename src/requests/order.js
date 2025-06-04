import api from "@utils/request";

export const getOrders = async () => {
  try {
    const res = await api.get(`/orders/search`);
    // Assuming your backend returns the array of IDs in res.data
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy đơn vị:", error);
    // Return an empty array as default
    return { data: [] };
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
