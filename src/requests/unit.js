import api from "@utils/request";

export const getUnits = async () => {
  try {
    const res = await api.get(`/units/get-all`);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy đơn vị:", error);
    return error;
  }
};

export const createUnit = async (data) => {
  try {
    const res = await api.post("/units/create", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi tạo đơn vị:", error?.response?.data);
    return error;
  }
};

export const getPagableUnits = async (searchDTO = { page: 0, size: 5 }) => {
  try {
    const response = await api.post(`/units/search`, searchDTO);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy đơn vị:", error);
    return error;
  }
};

export const updateUnit = async (id, unitName) => {
  try {
    const response = await api.put(`/units/${id}`, unitName, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn vị:", error?.response?.data);
    return error;
  }
};

export const deleteUnit = async (id) => {
  try {
    const response = await api.delete(`/units/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa đơn vị:", error?.response?.data);
    return error;
  }
};
