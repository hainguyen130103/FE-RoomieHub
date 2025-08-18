import api from "../axios";

export const loginApi = async (email, password) => {
  const payload = { email, password };

  try {
    // Clear any existing token before login
    localStorage.removeItem("accessToken");

    const response = await api.post("/api/auth/login", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Login response:", response.data); // Debug response

    const token = response.data.token;
    if (!token) {
      throw new Error("Token không được tìm thấy trong response");
    }

    // Save new token
    localStorage.setItem("accessToken", token);

    // Verify token saved correctly
    const savedToken = localStorage.getItem("accessToken");
    console.log("Saved token:", savedToken);

    // Verify token format
    if (!savedToken.startsWith("ey")) {
      throw new Error("Token format không hợp lệ");
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
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
  const token = localStorage.getItem("accessToken");
  console.log("API Request Payload:", apartmentData);
  
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  return api.put(`/api/apartments/${id}`, apartmentData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Xóa một căn hộ theo ID
export const deleteApartmentApi = (id) => {
  const token = localStorage.getItem("accessToken");
  
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  return api.delete(`/api/apartments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Lấy danh sách tất cả các căn hộ
export const getAllApartmentsApi = () => {
  return api.get("/api/apartments");
};

// Tạo một căn hộ mới
export const createApartmentApi = (apartmentData) => {
  const token = localStorage.getItem("accessToken");
  console.log("API Request Payload:", apartmentData);

  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

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

export const createSurveyApi = (surveyData) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  return api.post("/api/surveys", surveyData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getUserProfileApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/surveys/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getUserProfileApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

export const updateUserSurvey = async (surveyData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.put("/api/surveys/me", surveyData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in updateUserSurvey:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

// Lấy danh sách bài đăng của user
export const getMyApartmentsApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/apartments/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getMyApartmentsApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

// Lấy số lượng bài đăng của user
export const getMyApartmentsCountApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/apartments/my/count", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getMyApartmentsCountApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

// ===================== PAY-OS CONTROLLER =====================

// Nhận webhook từ PayOS
export const receivePaymentHookApi = (data) => {
  return api.post("/api/payment/receive-hook", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Tạo thanh toán mới
export const createPaymentApi = (paymentData) => {
  return api.post("/api/payment/create", paymentData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Hủy thanh toán
export const cancelPaymentApi = (cancelData) => {
  return api.post("/api/payment/cancel-payment", cancelData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Lấy thông tin thanh toán theo orderCode
export const getPaymentByOrderCodeApi = (orderCode) => {
  return api.get(`/api/payment/${orderCode}`);
};

// ===================== ROOMMATE POST CONTROLLER =====================

export const getAllRoommatePostsApi = () => {
  return api.get("/api/roommate-posts");
};

// Lấy bài đăng theo ID
export const getRoommatePostByIdApi = (id) => {
  return api.get(`/api/roommate-posts/${id}`);
};

// Tạo bài đăng mới
export const createRoommatePostApi = (postData) => {
  const token = localStorage.getItem("accessToken");
  console.log("API Request Payload:", postData);
  console.log("Token from localStorage:", token ? "Token exists" : "No token");

  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  return api.post("/api/roommate-posts", postData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // thêm token vào header
    },
  });
};

// Cập nhật bài đăng
export const updateRoommatePostApi = (id, postData) => {
  const token = localStorage.getItem("accessToken");
  console.log("API Update Payload:", postData);

  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  return api.put(`/api/roommate-posts/${id}`, postData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Xóa bài đăng
export const deleteRoommatePostApi = (id) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  return api.delete(`/api/roommate-posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Lọc bài đăng
export const filterRoommatePostsApi = (filterCriteria) => {
  console.log("API Filter Payload:", filterCriteria);
  return api.post("/api/roommate-posts/filter", filterCriteria, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Lấy bài đăng của user hiện tại
export const getMyRoommatePostsApi = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  return api.get("/api/roommate-posts/my-posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Lấy số lượng bài đăng của user
export const getMyRoommatePostsCountApi = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  return api.get("/api/roommate-posts/my-posts/count", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ===================== ADMIN PAYMENT STATS APIs =====================

// Lấy thống kê users đã trả phí
export const getPaymentStatsApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/admin/payments/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getPaymentStatsApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

// Lấy thống kê tổng doanh thu
export const getPaymentStatisticsApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/admin/payments/statistics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getPaymentStatisticsApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

// Lấy thống kê theo thời gian
export const getPaymentStatisticsByPeriodApi = async (month, year) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/admin/payments/statistics/period", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { month, year },
    });
    return response;
  } catch (error) {
    console.error("Error in getPaymentStatisticsByPeriodApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

export const getAllUsersApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getAllUsersApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

// Lấy thông tin chi tiết users (API mới)
export const getUsersInfoApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/admin/users-info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getUsersInfoApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

// Cập nhật role user (USER/ADMIN)
export const updateUserRoleApi = async (email, role) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.put(
      "/api/admin/payments/user/update-role",
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { email, role },
      }
    );
    return response;
  } catch (error) {
    console.error("Error in updateUserRoleApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

// Lấy số lượng apartments
export const getApartmentsCountApi = () => {
  return api.get("/api/apartments/count");
};

// ===================== USER PACKAGES CONTROLLER =====================

// Lấy danh sách gói của user hiện tại
export const getMyPackagesApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  try {
    const response = await api.get("/api/user/my-packages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getMyPackagesApi:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

export const getApartmentPostAuto = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Vui lòng đăng nhập để sử dụng tính năng.");
  }

  try {
    const response = await api.get("/api/apartment-recommendation/matching", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getApartmentAuto:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};

export const getRoomatePostAuto = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Vui lòng đăng nhập để sử dụng tính năng.");
  }

  try {
    const response = await api.get("/api/recommendations/roommate-posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error in getRoomatePostAuto:", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw error;
  }
};
