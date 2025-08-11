// src/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cho phép gửi cookie nếu backend hỗ trợ
});

// ==== REQUEST INTERCEPTOR ====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }

    // Debug request
    console.groupCollapsed("🚀 API Request");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("Method:", config.method?.toUpperCase());
    console.log("Authorization:", !!token ? "Bearer ***" : "None");
    console.groupEnd();

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// ==== RESPONSE INTERCEPTOR ====
api.interceptors.response.use(
  (response) => {
    // Debug response
    console.groupCollapsed("📩 API Response");
    console.log("URL:", `${response.config.baseURL}${response.config.url}`);
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.groupCollapsed("❌ API Response Error");
    console.log("URL:", error.config?.url);
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.groupEnd();

    if (error.response?.status === 401) {
      console.warn(
        "⚠️ Unauthorized (401) - Phiên có thể hết hạn hoặc token không hợp lệ."
      );
      // ❌ Không xóa token tự động ở đây
      // ✅ Xử lý redirect ở tầng cao hơn (App.jsx / Auth wrapper)
    }

    return Promise.reject(error);
  }
);

export default api;
