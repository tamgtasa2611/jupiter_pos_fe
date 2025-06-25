import axios from "axios";
import { getToken } from "@utils/utils";

// Tạo instance mặc định
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api", // Sửa lại baseURL cho phù hợp
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor cho request (ví dụ: thêm token)
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? getToken() : null;
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
    // todo: phân biệt với lỗi khác là nhân viên ko có quyền
    if (error?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/dang-nhap";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
