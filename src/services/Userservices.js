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
    
    console.log('Login response:', response.data); // Debug response
    
    const token = response.data.token;
    if (!token) {
      throw new Error('Token không được tìm thấy trong response');
    }
    
    // Save new token
    localStorage.setItem("accessToken", token);
    
    // Verify token saved correctly
    const savedToken = localStorage.getItem('accessToken');
    console.log('Saved token:', savedToken);
    
    // Verify token format
    if (!savedToken.startsWith('ey')) {
      throw new Error('Token format không hợp lệ');
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
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
export const createApartmentApi = (apartmentData, token) => {
  console.log("API Request Payload:", apartmentData);
  return api.post("/api/apartments", apartmentData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
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

export const createSurveyApi = (surveyData, token) => {
  return api.post("/api/surveys", surveyData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
};

export const getUserProfileApi = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await api.get("/api/surveys/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error in getUserProfileApi:', error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw error;
  }
};

export const updateUserSurvey = async (surveyData) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await api.put("/api/surveys/me", surveyData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error in updateUserSurvey:', error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw error;
  }
};

// Lấy danh sách bài đăng của user
export const getMyApartmentsApi = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await api.get("/api/apartments/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error in getMyApartmentsApi:', error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw error;
  }
};

// Lấy số lượng bài đăng của user
export const getMyApartmentsCountApi = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
  }

  try {
    const response = await api.get("/api/apartments/my/count", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Error in getMyApartmentsCountApi:', error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw error;
  }
};
