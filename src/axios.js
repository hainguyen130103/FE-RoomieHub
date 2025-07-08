// src/axios.js
import axios from "axios";

const api = axios.create({
  // baseURL: "https://roomiehub-production-89c0.up.railway.app",
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && !config.url.includes("auth/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
