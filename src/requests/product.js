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

export const getProductsWithVariants = async (params = {}) => {
  try {
    const res = await api.get("/products/search-variant", { params });
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy productVariants:", error);
    return [];
  }
};
