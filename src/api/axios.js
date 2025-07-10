import axios from "../../api/axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Đổi thành API backend của bạn
  // headers: { ... } // Thêm nếu cần
});

export default instance;