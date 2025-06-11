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

export const getOrderById = async (id) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
