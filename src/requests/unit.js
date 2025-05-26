import api from "@utils/request";

export const getUnits = async () => {
  try {
    const res = await api.get(`/units/search`);
    // Assuming your backend returns the array of IDs in res.data
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy đơn vị:", error);
    // Return an empty array as default
    return { data: [] };
  }
};

export const createUnit = async (data) => {
  try {
    const res = await api.post("/units/create", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi tạo đơn vị:", error);
    return [];
  }
};
