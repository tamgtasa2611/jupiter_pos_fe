import api from "@utils/request";

export const getCategories = async () => {
  try {
    const categories = await api.get(`/categories/get-all`);
    return categories;
  } catch (error) {
    console.error("Lỗi khi lấy categories:", error);
    return error;
  }
};

export const getPagableCategories = async (
  searchDTO = { page: 0, size: 5 },
) => {
  try {
    const response = await api.post(`/categories/search`, searchDTO);
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy categories:", error);
    return error;
  }
};

export const createCategory = async (data) => {
  try {
    const categories = await api.post(`/categories/add`, data);
    return categories;
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error?.response?.data);
    return error;
  }
};

export const updateCategory = async (id, categoryName) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryName, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error?.response?.data);
    return error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error?.response?.data);
    return error;
  }
};
