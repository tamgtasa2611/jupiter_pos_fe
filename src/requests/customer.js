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

export const getCustomerById = async (id) => {
  try {
    const res = await api.get(`/customers/${id}`);
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

export const updateCustomer = async (id, data = {}) => {
  try {
    const res = await api.put(`/customers/${id}`, data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const res = await api.delete(`/customers/delete/${customerId}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
