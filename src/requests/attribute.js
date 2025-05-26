import api from "@utils/request";

export const getAttributes = async () => {
  try {
    const res = await api.get(`/attributes/search`);
    // Assuming your backend returns the array of IDs in res.data
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy productVariants:", error);
    // Return an empty array as default
    return { data: [] };
  }
};

export const createAttribute = async (data) => {
  try {
    const res = await api.post("/attributes/create", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi tạo thuộc tính:", error);
    return [];
  }
};
