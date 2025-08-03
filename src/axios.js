// src/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

// Thêm interceptor để debug
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("Request URL:", config.url); // Log URL being called
    console.log("Current token:", token); // Debug token

    if (token) {
      // Đảm bảo token không có khoảng trắng ở đầu hoặc cuối
      const cleanToken = token.trim();
      config.headers["Authorization"] = `Bearer ${cleanToken}`;
      console.log("Request headers:", JSON.stringify(config.headers, null, 2)); // Pretty print headers
    } else {
      console.warn("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      console.warn("Unauthorized request detected");
      localStorage.removeItem("accessToken"); // Clear invalid token
      // Có thể thêm logic chuyển hướng về trang login ở đây
    }
    return Promise.reject(error);
  }
);(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
