import api from "@utils/request";

export const getAttributes = async () => {
  try {
    const res = await api.get(`/attributes/get-all`);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy thuộc tính:", error);
    return error;
  }
};

export const createAttribute = async (data) => {
  try {
    const res = await api.post("/attributes/create", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi tạo thuộc tính:", error?.response?.data);
    return error;
  }
};

export const getPagableAttributes = async (
  searchDTO = { page: 0, size: 5 },
) => {
  try {
    const response = await api.post(`/attributes/search`, searchDTO);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thuộc tính:", error);
    return error;
  }
};

export const updateAttribute = async (id, attributeName) => {
  try {
    const response = await api.put(`/attributes/${id}`, attributeName, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật thuộc tính:", error?.response?.data);
    return error;
  }
};

export const deleteAttribute = async (id) => {
  try {
    const response = await api.delete(`/attributes/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa thuộc tính:", error?.response?.data);
    return error;
  }
};
