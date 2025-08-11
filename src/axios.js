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

    console.group("🚀 API Request");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("Method:", config.method?.toUpperCase());
    console.log("Token found:", !!token);

    if (token) {
      const cleanToken = token.trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
      console.log("Authorization header set");
    }

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
    console.group("📩 API Response");
    console.log("URL:", `${response.config.baseURL}${response.config.url}`);
    console.log("Status:", response.status);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group("❌ API Response Error");
    console.log("URL:", error.config?.url);
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.groupEnd();

    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized (401) - redirect to login");
      // Giữ token để debug nếu cần
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
