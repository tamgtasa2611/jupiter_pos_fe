import api from "@utils/request";

export const getReveneues = async () => {
  try {
    const res = await api.get(`/statistic/revenues`);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu!", error);
    return { data: [] };
  }
};

export const getNetReveneues = async () => {
  try {
    const res = await api.get(`/statistic/net-revenues`);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu!", error);
    return { data: [] };
  }
};


export const getProductData = async (data) => {
  try {
    const res = await api.post("/statistic/products", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm!", error?.response?.data);
    return { data: [] };
  }
};

export const getCustomerData= async (data) => {
  try {
    const res = await api.post("/statistic/customers", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu!", error?.response?.data);
    return { data: [] };
  }
};