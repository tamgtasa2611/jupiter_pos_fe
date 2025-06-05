import api from "@utils/request";

export const getCustomers = async (params = {}) => {
  try {
    const res = await api.post(`/customers/search`, params);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
