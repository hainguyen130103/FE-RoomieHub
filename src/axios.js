// src/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Đổi thành URL backend của bạn nếu khác
  // timeout: 10000,
});

export default api;
