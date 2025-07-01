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

export const getNetReveneues = async (data) => {
  try {
    const res = await api.post(`/statistic/net-revenues`, data);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu!", error?.response?.data);
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

export const getCustomerData = async (data) => {
  try {
    const res = await api.post("/statistic/customers", data);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu!", error?.response?.data);
    return { data: [] };
  }
};

export const getInactiveCustomers = async (data) => {
  try {
    const res = await api.get("/statistic/inactive-customers", {
      params: {
        sortBy: data?.sortBy,
        sortDirection: data?.sortDirection,
      },
    });
    return res;
  } catch (error) {
    console.error(
      "Lỗi khi lấy dữ liệu khách hàng không hoạt động!",
      error?.response?.data,
    );
    throw error?.response?.data?.message || "Lỗi không xác định";
  }
};

export const getNewCustomers = async (params = {}) => {
  try {
    const response = await api.get("/statistic/new-customers", {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu khách hàng mới!", error?.response?.data);
    throw error?.response?.data?.message || "Lỗi không xác định";
  }
};

export const getProductLowInventory = async () => {
  try {
    const response = await api.get("/statistic/products/low-inventory");
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm!", error?.response?.data);
    throw error?.response?.data?.message || "Lỗi không xác định";
  }
};

export const getProductDeadStock = async () => {
  try {
    const res = await api.get(`/statistic/products/dead-stock`);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu!", error);
    return { data: [] };
  }
};

export const getOrderStatusStatistic = async (data) => {
  try {
    const res = await api.post(`/statistic/orders/status`, data);
    return res;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu!", error?.response?.data);
    return { data: [] };
  }
};

export const getPaymentMethodStats = async (params = {}) => {
  try {
    const response = await api.get("/statistic/payment-methods", {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
    return response;
  } catch (error) {
    console.error(
      "Error fetching payment method stats:",
      error?.response?.data?.message,
    );
    throw error?.response?.data?.message || "Lỗi không xác định";
  }
};

export const getRevenueByDates = async (params = {}) => {
  try {
    const response = await api.get("/statistic/get-revenue-by-dates", {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
    return response;
  } catch (error) {
    console.error(
      "Lỗi khi lấy dữ liệu doanh thu theo ngày!",
      error?.response?.data,
    );
    throw error?.response?.data?.message || "Lỗi không xác định";
  }
};
