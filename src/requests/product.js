import api from "@utils/request";

export const getProducts = async (data) => {
  try {
    const productVariants = await api.get(
      `/product-variants/search/${data.productId}`,
    );
    return productVariants;
  } catch (error) {
    console.error("Lỗi khi lấy productVariants:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/search-detail/${id}`);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy product:", error);
    return [];
  }
};

export const getProductsWithVariants = async (data) => {
  try {
    const products = await api.post(`/products/search-with-variants`, data);
    return products;
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

export const updateProduct = async (id, data) => {
  try {
    const res = await api.put(`/products/update/${id}`, data);
    return res;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return [];
  }
};

export const updateProductStatus = async (id, data) => {
  try {
    const res = await api.put(`/products/update-status/${id}`, data);
    return res;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    return [];
  }
};

export const createVariant = async (productId, data) => {
  try {
    const res = await api.post(`/product-variants/add/${productId}`, data);
    return res;
  } catch (error) {
    console.error("Lỗi khi thêm biến thể sản phẩm:", error);
    return [];
  }
};

export const updateVariant = async (id, data) => {
  try {
    const res = await api.put(`/product-variants/update/${id}`, data);
    return res;
  } catch (error) {
    console.error("Lỗi khi cập nhật biến thể sản phẩm:", error);
    return [];
  }
};
