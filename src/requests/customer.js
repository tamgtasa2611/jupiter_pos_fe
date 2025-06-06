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

export const createCustomer = async (data = {}) => {
  try {
    const res = await api.post(`/customers`, data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
