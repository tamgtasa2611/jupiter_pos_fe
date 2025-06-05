import api from "@utils/request";

export const getOrders = async (params = {}) => {
  try {
    const res = await api.post(`/orders/search`, params);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createOrder = async (data) => {
  try {
    const res = await api.post("/orders/create", data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
