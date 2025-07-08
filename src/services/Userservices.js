import api from "../axios";

export const loginApi = (email, password) => {
  const payload = { email, password };
  console.log("API Request payload: ", payload);

  return api.post("/api/auth/login", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const registerApi = (email, password, fullname) => {
  const payload = {
    email,
    password,
    fullname,
  };

  console.log("API Request Payload:", payload);

  return api.post("/api/auth/register", payload);
};

// Lấy thông tin một căn hộ theo ID
export const getApartmentByIdApi = (id) => {
  return api.get(`/api/apartments/${id}`);
};

// Cập nhật thông tin một căn hộ theo ID
export const updateApartmentApi = (id, apartmentData) => {
  console.log("API Request Payload:", apartmentData);
  return api.put(`/api/apartments/${id}`, apartmentData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Xóa một căn hộ theo ID
export const deleteApartmentApi = (id) => {
  return api.delete(`/api/apartments/${id}`);
};

// Lấy danh sách tất cả các căn hộ
export const getAllApartmentsApi = () => {
  return api.get("/api/apartments");
};

// Tạo một căn hộ mới
export const createApartmentApi = (apartmentData) => {
  console.log("API Request Payload:", apartmentData);
  return api.post("/api/apartments", apartmentData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Lọc danh sách căn hộ
export const filterApartmentsApi = (filterCriteria) => {
  console.log("API Request Payload:", filterCriteria);
  return api.post("/api/apartments/filter", filterCriteria, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Tìm kiếm căn hộ
export const searchApartmentsApi = (searchParams) => {
  // searchParams có thể là một object, ví dụ: { keyword: '...', location: '...' }
  // Axios sẽ tự động chuyển nó thành query string: /api/apartments/search?keyword=...&location=...
  return api.get("/api/apartments/search", { params: searchParams });
};

// Tìm kiếm các căn hộ ở gần
export const getNearbyApartmentsApi = (locationParams) => {
  // locationParams có thể là một object, ví dụ: { lat: '...', long: '...' }
  // Axios sẽ tự động chuyển nó thành query string: /api/apartments/nearby?lat=...&long=...
  return api.get("/api/apartments/nearby", { params: locationParams });
};
