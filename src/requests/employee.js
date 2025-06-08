import api from "@utils/request";

export const getEmployees = async (params = {}) => {
  try {
    const res = await api.post(`/users/search-users`, params);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createEmployee = async (data = {}) => {
  try {
    const res = await api.post(`/users`, data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateEmployee = async (id, data = {}) => {
  try {
    const res = await api.put(`/users/${id}`, data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
