import api from "@utils/request";

export const getCategories = async () => {
  try {
    const categories = await api.get(`/categories/search`);
    console.log(categories);
    return categories;
  } catch (error) {
    console.error("Lỗi khi lấy categories:", error);
    return [];
  }
};
