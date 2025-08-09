import axios from "axios";

const api = axios.create({
  // baseURL: "https://roomiehub-production-89c0.up.railway.app",
  baseURL: "http://localhost:8080",
});

// Request interceptor: tự động gắn token nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && !config.url.includes("auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: xử lý lỗi 401 hợp lý
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("API trả 401:", error.response.data);

      // Chỉ xóa token nếu server trả lỗi liên quan đến token
      const errMsg = error.response.data?.message?.toLowerCase() || "";
      if (errMsg.includes("token") || errMsg.includes("jwt")) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
