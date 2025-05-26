import api from "@utils/request";

export const getCategories = async () => {
  try {
    const categories = await api.get(`/categories/search`);
    return categories;
  } catch (error) {
    console.error("Lỗi khi lấy categories:", error);
    return [];
  }
};

export const createCategory = async (data) => {
  try {
    const categories = await api.post(`/categories/add`, data);
    return categories;
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    return [];
  }
};
