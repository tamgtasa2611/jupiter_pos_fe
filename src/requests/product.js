import api from "@utils/request";

export const getProducts = async (data) => {
  try {
    const productVariants = await api.get(
      `/product-variants/search/${data.productId}`,
    );
    console.log(productVariants);
    return productVariants;
  } catch (error) {
    console.error("Lỗi khi lấy productVariants:", error);
    return [];
  }
};

export const getProductsVariants = async (params = {}) => {
  try {
    const res = await api.get("/product-variants/search", { params });
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy productVariants:", error);
    return [];
  }
};

export const getProductVariantById = async (id) => {
  try {
    const res = await api.get(`/product-variants/search-variant/${id}`);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy productVariants:", error);
    return [];
  }
};

export const getAllIds = async () => {
  try {
    const res = await api.get(`/product-variants/get-all-ids`);
    // Assuming your backend returns the array of IDs in res.data
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy productVariants:", error);
    // Return an empty array as default
    return { data: [] };
  }
};

export const createProduct = async (data) => {
  try {
    const res = await api.post("/products/create", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    return [];
  }
};
