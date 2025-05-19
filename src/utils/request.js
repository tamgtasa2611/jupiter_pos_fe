import axios from "axios";

// Tạo instance mặc định
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    // "https://66a484f95dc27a3c19091759.mockapi.io/api/v1", // Sửa lại baseURL cho phù hợp
    "http://localhost:8080/api", // Sửa lại baseURL cho phù hợp
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor cho request (ví dụ: thêm token)
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Thêm interceptor cho response (xử lý lỗi chung)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Có thể xử lý lỗi toàn cục ở đây (ví dụ: thông báo hết hạn phiên đăng nhập)
    return Promise.reject(error);
  },
);

export default api;
