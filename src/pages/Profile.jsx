import React, { Component } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { getUserProfileApi, updateUserSurvey } from "../services/Userservices";
import GoogleMapPicker from "../components/GoogleMapPicker";
import SidebarNav from "../components/layouts/SidebarNav";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "profile",
      userInfo: null,
      loading: true,
      error: null,
      isEditing: false,
      showPreferences: false, // Riêng cho phần sở thích
      showApartmentInfo: false, // Riêng cho phần căn hộ
      showMapPicker: false, // Cho Google Maps picker
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Token in Profile:", token);

      if (!token) {
        this.props.navigate("/"); // Chuyển về trang chủ
        return;
      }

      this.setState({ loading: true, error: null });

      // Fetch user data
      const response = await getUserProfileApi();

      if (response.data) {
        this.setState({ userInfo: response.data });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      if (
        err.message.includes("Phiên đăng nhập đã hết hạn") ||
        !localStorage.getItem("accessToken")
      ) {
        this.props.navigate("/");
        return;
      }
      this.setState({ error: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleLogout = () => {
    localStorage.removeItem("accessToken");
    this.props.navigate("/");
  };

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
    if (tab === "profile") {
      window.location.href = "/profile";
    } else if (tab === "packages") {
      window.location.href = "/packages";
    } else if (tab === "posts") {
      window.location.href = "/posts";
    } else if (tab === "roommates") {
      window.location.href = "/roommates";
    } else if (tab === "chat") {
      window.location.href = "/chat";
    }
  };

  setIsEditing = (editing) => {
    this.setState({ isEditing: editing });
  };

  setShowPreferences = (show) => {
    this.setState({ showPreferences: show });
  };

  setShowApartmentInfo = (show) => {
    this.setState({ showApartmentInfo: show });
  };

  setShowMapPicker = (show) => {
    this.setState({ showMapPicker: show });
  };

  handleLocationSelect = (locationData) => {
    this.updateUserInfo({
      currentLatitude: locationData.latitude,
      currentLongitude: locationData.longitude,
    });
  };

  updateUserInfo = (updates) => {
    this.setState((prevState) => ({
      userInfo: { ...prevState.userInfo, ...updates },
    }));
  };

  // Helper function to format birthday for display
  formatBirthdayForDisplay = (birthYear) => {
    if (!birthYear) return "";

    // If it's already in dd/mm/yyyy format, return as is
    if (typeof birthYear === "string" && birthYear.includes("/")) {
      return birthYear;
    }

    // If it's a number or string with 4 digits, assume it's a year
    if (
      typeof birthYear === "number" ||
      (typeof birthYear === "string" && birthYear.length === 4)
    ) {
      const year = parseInt(birthYear);
      if (year && year > 1900 && year <= new Date().getFullYear()) {
        return `01/01/${year}`;
      }
    }

    // If it's a string with 7-8 digits, convert to dd/mm/yyyy
    if (
      typeof birthYear === "string" &&
      (birthYear.length === 7 || birthYear.length === 8)
    ) {
      let paddedBirthYear = birthYear;

      // If 7 digits, add leading zero
      if (birthYear.length === 7) {
        paddedBirthYear = "0" + birthYear;
      }

      // Ensure it's 8 digits
      if (paddedBirthYear.length === 8) {
        const day = paddedBirthYear.substring(0, 2);
        const month = paddedBirthYear.substring(2, 4);
        const year = paddedBirthYear.substring(4, 8);

        // Validate date
        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (
          dayNum >= 1 &&
          dayNum <= 31 &&
          monthNum >= 1 &&
          monthNum <= 12 &&
          yearNum >= 1900 &&
          yearNum <= new Date().getFullYear()
        ) {
          return `${day}/${month}/${year}`;
        }
      }
    }

    // If it's any other string with numbers, try to format it
    if (typeof birthYear === "string" && /^\d+$/.test(birthYear)) {
      let paddedBirthYear = birthYear;

      // If less than 8 digits, pad with zeros
      if (birthYear.length < 8) {
        paddedBirthYear = birthYear.padStart(8, "0");
      } else if (birthYear.length > 8) {
        paddedBirthYear = birthYear.substring(0, 8);
      }

      if (paddedBirthYear.length === 8) {
        const day = paddedBirthYear.substring(0, 2);
        const month = paddedBirthYear.substring(2, 4);
        const year = paddedBirthYear.substring(4, 8);

        // Validate date
        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (
          dayNum >= 1 &&
          dayNum <= 31 &&
          monthNum >= 1 &&
          monthNum <= 12 &&
          yearNum >= 1900 &&
          yearNum <= new Date().getFullYear()
        ) {
          return `${day}/${month}/${year}`;
        }
      }
    }

    return birthYear || "";
  };

  // Helper function to parse birthday from input
  parseBirthdayFromInput = (inputValue) => {
    if (!inputValue) return "";

    // Remove all non-digit characters
    const numbersOnly = inputValue.replace(/\D/g, "");

    // If we have 7 digits, add leading zero
    if (numbersOnly.length === 7) {
      return "0" + numbersOnly;
    }

    // If we have 8 digits, return as is
    if (numbersOnly.length === 8) {
      return numbersOnly;
    }

    // If we have 4 digits, assume it's a year
    if (numbersOnly.length === 4) {
      const year = parseInt(numbersOnly);
      if (year >= 1900 && year <= new Date().getFullYear()) {
        return `0101${year}`;
      }
    }

    // If we have less than 8 digits, pad with zeros
    if (numbersOnly.length < 8) {
      return numbersOnly.padEnd(8, "0");
    }

    // If we have more than 8 digits, take first 8
    if (numbersOnly.length > 8) {
      return numbersOnly.substring(0, 8);
    }

    return numbersOnly;
  };

  // New function to handle birthday input with cursor position
  handleBirthdayChange = (e) => {
    const input = e.target;
    const cursorPosition = input.selectionStart;
    const value = input.value;

    // Remove all non-digit characters
    const numbersOnly = value.replace(/\D/g, "");

    // Format as dd/mm/yyyy
    let formattedValue = "";
    if (numbersOnly.length > 0) {
      const day = numbersOnly.substring(0, 2);
      const month = numbersOnly.substring(2, 4);
      const year = numbersOnly.substring(4, 8);

      if (day) formattedValue += day;
      if (month) formattedValue += `/${month}`;
      if (year) formattedValue += `/${year}`;
    }

    // Update the input value
    input.value = formattedValue;

    // Calculate new cursor position
    let newCursorPosition = cursorPosition;
    const originalLength = value.length;
    const newLength = formattedValue.length;

    // Adjust cursor position based on formatting changes
    if (newLength > originalLength) {
      // Added slashes, move cursor forward
      const addedSlashes =
        (formattedValue.match(/\//g) || []).length -
        (value.match(/\//g) || []).length;
      newCursorPosition += addedSlashes;
    } else if (newLength < originalLength) {
      // Removed characters, adjust cursor
      newCursorPosition = Math.min(cursorPosition, formattedValue.length);
    }

    // Set cursor position
    setTimeout(() => {
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);

    // Update state with numbers only (ensure 8 digits)
    let stateValue = numbersOnly;
    if (numbersOnly.length === 7) {
      stateValue = "0" + numbersOnly;
    } else if (numbersOnly.length < 8) {
      stateValue = numbersOnly.padEnd(8, "0");
    } else if (numbersOnly.length > 8) {
      stateValue = numbersOnly.substring(0, 8);
    }

    this.updateUserInfo({ birthYear: stateValue });
  };

  // Function to get formatted birthday for display
  getFormattedBirthday = () => {
    const { userInfo } = this.state;
    if (!userInfo || !userInfo.birthYear) return "";

    const birthYear = userInfo.birthYear.toString();

    // If it's already in dd/mm/yyyy format, return as is
    if (birthYear.includes("/")) {
      return birthYear;
    }

    // If it's 7 digits, add leading zero
    if (birthYear.length === 7) {
      const padded = "0" + birthYear;
      return `${padded.substring(0, 2)}/${padded.substring(2, 4)}/${padded.substring(4, 8)}`;
    }

    // If it's 8 digits, format directly
    if (birthYear.length === 8) {
      return `${birthYear.substring(0, 2)}/${birthYear.substring(2, 4)}/${birthYear.substring(4, 8)}`;
    }

    // If it's 4 digits, assume it's a year
    if (birthYear.length === 4) {
      const year = parseInt(birthYear);
      if (year >= 1900 && year <= new Date().getFullYear()) {
        return `01/01/${year}`;
      }
    }

    // For any other case, try to pad and format
    let padded = birthYear;
    if (padded.length < 8) {
      padded = padded.padStart(8, "0");
    } else if (padded.length > 8) {
      padded = padded.substring(0, 8);
    }

    if (padded.length === 8) {
      return `${padded.substring(0, 2)}/${padded.substring(2, 4)}/${padded.substring(4, 8)}`;
    }

    return birthYear;
  };

  navItems = [
    { id: "profile", label: "Thông tin cá nhân", icon: "pi pi-user" },
    { id: "packages", label: "Gói dịch vụ", icon: "pi pi-box" },
    { id: "posts", label: "Bài đăng", icon: "pi pi-file" },
    { id: "roommates", label: "Nhóm ở ghép", icon: "pi pi-users" },
  ];

  renderError = () => {
    const { error } = this.state;
    if (!error) return null;

    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        <div className="flex items-center">
          <i className="pi pi-exclamation-circle mr-2" />
          <span className="font-medium">Lỗi:</span>
          <span className="ml-2">{error}</span>
        </div>
      </div>
    );
  };

  renderPreferencesSection = (userData, isEditing) => {
    const { showPreferences } = this.state;

    const priceRangeOptions = [
      { label: "Dưới 3 triệu", value: "BELOW_3M" },
      { label: "3-5 triệu", value: "FROM_3M_TO_5M" },
      { label: "5-7 triệu", value: "FROM_5M_TO_7M" },
      { label: "Trên 7 triệu", value: "ABOVE_7M" },
    ];

    const preferredLocationOptions = [
      { label: "Gần trường đại học", value: "NEAR_UNIVERSITY" },
      { label: "Gần khu vực kinh doanh", value: "NEAR_BUSINESS_AREA" },
      { label: "Khu vực yên tĩnh", value: "QUIET_AREA" },
    ];

    const yesNoOptions = [
      { label: "Có", value: "YES" },
      { label: "Không", value: "NO" },
    ];

    const cookFrequencyOptions = [
      { label: "Không bao giờ", value: "NEVER" },
      { label: "Thỉnh thoảng", value: "SOMETIMES" },
      { label: "Thường xuyên", value: "OFTEN" },
    ];

    const sleepHabitOptions = [
      { label: "Ngủ sớm", value: "EARLY_SLEEPER" },
      { label: "Cú đêm", value: "NIGHT_OWL" },
      { label: "Linh hoạt", value: "FLEXIBLE" },
    ];

    return (
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-heart text-orange-500 text-xl"></i>
            <h2 className="text-xl font-semibold">Thông tin sở thích</h2>
          </div>
          <Button
            icon={showPreferences ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            label={showPreferences ? "Thu gọn" : "Mở rộng"}
            className="p-button-text text-orange-500"
            onClick={() => this.setShowPreferences(!showPreferences)}
          />
        </div>

        {showPreferences && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Khoảng giá</label>
                <select
                  value={userData.priceRange}
                  onChange={(e) =>
                    this.updateUserInfo({ priceRange: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn khoảng giá</option>
                  {priceRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">
                  Vị trí ưa thích
                </label>
                <select
                  value={userData.preferredLocation}
                  onChange={(e) =>
                    this.updateUserInfo({ preferredLocation: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn vị trí</option>
                  {preferredLocationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Hút thuốc</label>
                <select
                  value={userData.smoking}
                  onChange={(e) =>
                    this.updateUserInfo({ smoking: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn</option>
                  {yesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Thú cưng</label>
                <select
                  value={userData.pets}
                  onChange={(e) =>
                    this.updateUserInfo({ pets: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn</option>
                  {yesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">
                  Tần suất nấu ăn
                </label>
                <select
                  value={userData.cookFrequency}
                  onChange={(e) =>
                    this.updateUserInfo({ cookFrequency: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn tần suất</option>
                  {cookFrequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">
                  Thói quen ngủ
                </label>
                <select
                  value={userData.sleepHabit}
                  onChange={(e) =>
                    this.updateUserInfo({ sleepHabit: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn thói quen</option>
                  {sleepHabitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Mời bạn bè</label>
                <select
                  value={userData.inviteFriends}
                  onChange={(e) =>
                    this.updateUserInfo({ inviteFriends: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn</option>
                  {yesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  renderApartmentSection = (userData, isEditing) => {
    const { showApartmentInfo } = this.state;

    const levelOptions = [
      { label: "Cơ bản", value: "BASIC" },
      { label: "Tiêu chuẩn", value: "STANDARD" },
      { label: "Đầy đủ", value: "FULL" },
    ];

    const genderRequirementOptions = [
      { label: "Nam", value: "MALE" },
      { label: "Nữ", value: "FEMALE" },
      { label: "Không yêu cầu", value: "ANY" },
    ];

    return (
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-home text-orange-500 text-xl"></i>
            <h2 className="text-xl font-semibold">Thông tin căn hộ</h2>
          </div>
          <Button
            icon={showApartmentInfo ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            label={showApartmentInfo ? "Thu gọn" : "Mở rộng"}
            className="p-button-text text-orange-500"
            onClick={() => this.setShowApartmentInfo(!showApartmentInfo)}
          />
        </div>

        {showApartmentInfo && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Giá (VNĐ)</label>
                <input
                  type="number"
                  value={userData.price}
                  onChange={(e) =>
                    this.updateUserInfo({ price: parseFloat(e.target.value) })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">
                  Diện tích (m²)
                </label>
                <input
                  type="number"
                  value={userData.area}
                  onChange={(e) =>
                    this.updateUserInfo({ area: parseFloat(e.target.value) })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">
                  Đặt cọc (VNĐ)
                </label>
                <input
                  type="number"
                  value={userData.deposit}
                  onChange={(e) =>
                    this.updateUserInfo({ deposit: parseFloat(e.target.value) })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Tiện ích</label>
                <select
                  value={userData.utilities}
                  onChange={(e) =>
                    this.updateUserInfo({ utilities: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn tiện ích</option>
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Nội thất</label>
                <select
                  value={userData.furniture}
                  onChange={(e) =>
                    this.updateUserInfo({ furniture: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn nội thất</option>
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">
                  Yêu cầu giới tính
                </label>
                <select
                  value={userData.genderRequiment}
                  onChange={(e) =>
                    this.updateUserInfo({ genderRequiment: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn giới tính</option>
                  {genderRequirementOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Địa chỉ</label>
              <input
                type="text"
                value={userData.location}
                onChange={(e) =>
                  this.updateUserInfo({ location: e.target.value })
                }
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  renderProfileContent = () => {
    const { loading, error, userInfo, isEditing } = this.state;

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <i className="pi pi-spin pi-spinner mr-2" />
          <span>Đang tải...</span>
        </div>
      );
    }

    // Hiển thị lỗi nếu có
    if (error) {
      return this.renderError();
    }

    // Default empty values if userInfo is null
    const defaultUserInfo = {
      userName: "",
      birthYear: "",
      hometown: "",
      gender: "",
      occupation: "",
      currentLatitude: "",
      currentLongitude: "",
      priceRange: "",
      preferredLocation: "",
      smoking: "",
      pets: "",
      cookFrequency: "",
      sleepHabit: "",
      inviteFriends: "",
      price: "",
      area: "",
      genderRequiment: "",
      deposit: "",
      utilities: "",
      furniture: "",
      location: "",
    };

    // Merge default values with actual userInfo
    const userData = { ...defaultUserInfo, ...(userInfo || {}) };

    const genderOptions = [
      { label: "Nam", value: "MALE" },
      { label: "Nữ", value: "FEMALE" },
      { label: "Khác", value: "OTHER" },
    ];

    const hometownOptions = [
      { label: "Hà Nội", value: "HANOI" },
      { label: "TP. Hồ Chí Minh", value: "HCM" },
      { label: "Đà Nẵng", value: "DANANG" },
      { label: "Huế", value: "HUE" },
      { label: "Khác", value: "OTHER" },
    ];

    const occupationOptions = [
      { label: "Sinh viên", value: "STUDENT" },
      { label: "Nhân viên văn phòng", value: "OFFICE_WORKER" },
      { label: "Freelancer", value: "FREELANCER" },
      { label: "Khác", value: "OTHER" },
    ];

    return (
      <div className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <i className="pi pi-user text-orange-500 text-xl"></i>
              <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    label="Hủy bỏ"
                    className="border-2 border-red-600 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200"
                    onClick={() => {
                      this.setIsEditing(false);
                      this.fetchData();
                    }}
                  />
                  <Button
                    label="Lưu lại"
                    className="border-2 border-green-600 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200"
                    onClick={async () => {
                      try {
                        this.setState({ loading: true });
                        const response = await updateUserSurvey(
                          this.state.userInfo
                        );
                        if (response.data) {
                          this.setState({ userInfo: response.data });
                        }
                        this.setIsEditing(false);
                      } catch (err) {
                        this.setState({ error: err.message });
                      } finally {
                        this.setState({ loading: false });
                      }
                    }}
                  />
                </>
              ) : (
                <Button
                  label="Chỉnh sửa"
                  icon="pi pi-pencil"
                  className="border-2 border-blue-600 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200 gap-2"
                  onClick={() => this.setIsEditing(true)}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Họ tên</label>
              <input
                type="text"
                value={userData.userName}
                onChange={(e) =>
                  this.updateUserInfo({ userName: e.target.value })
                }
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Nghề nghiệp</label>
              <select
                value={userData.occupation}
                onChange={(e) =>
                  this.updateUserInfo({ occupation: e.target.value })
                }
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Chọn nghề nghiệp</option>
                {occupationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Giới tính</label>
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    this.updateUserInfo({ gender: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn giới tính</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Ngày sinh</label>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  defaultValue={this.getFormattedBirthday()}
                  onChange={this.handleBirthdayChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Quê quán</label>
              <select
                value={userData.hometown}
                onChange={(e) =>
                  this.updateUserInfo({ hometown: e.target.value })
                }
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Chọn quê quán</option>
                {hometownOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">
                Vị trí hiện tại
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    label="Chọn vị trí trên bản đồ"
                    icon="pi pi-map-marker"
                    className="border-2 border-blue-600 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-200 gap-2"
                    onClick={() => this.setShowMapPicker(true)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Latitude"
                      value={userData.currentLatitude || ""}
                      onChange={(e) =>
                        this.updateUserInfo({
                          currentLatitude: parseFloat(e.target.value),
                        })
                      }
                      disabled={!isEditing}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Longitude"
                      value={userData.currentLongitude || ""}
                      onChange={(e) =>
                        this.updateUserInfo({
                          currentLongitude: parseFloat(e.target.value),
                        })
                      }
                      disabled={!isEditing}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                </div>

                {userData.currentLatitude && userData.currentLongitude && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-700">
                      <i className="pi pi-map-marker text-blue-500" />
                      <span className="text-sm font-medium">
                        Vị trí đã chọn:
                      </span>
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      {userData.currentLatitude.toFixed(6)},{" "}
                      {userData.currentLongitude.toFixed(6)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin sở thích - Section riêng biệt */}
        {this.renderPreferencesSection(userData, isEditing)}

        {/* Thông tin căn hộ - Section riêng biệt */}
        {this.renderApartmentSection(userData, isEditing)}
      </div>
    );
  };

  renderContent = () => {
    const { activeTab } = this.state;
    if (activeTab === "profile") {
      return this.renderProfileContent();
    }
    return null;
  };

  render() {
    const { showMapPicker } = this.state;

    return (
      <>
        <SidebarNav>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">{this.renderContent()}</div>
          </div>
        </SidebarNav>

        {/* Google Maps Picker */}
        <GoogleMapPicker
          isVisible={showMapPicker}
          onHide={() => this.setShowMapPicker(false)}
          onLocationSelect={this.handleLocationSelect}
          currentLat={this.state.userInfo?.currentLatitude}
          currentLng={this.state.userInfo?.currentLongitude}
        />
      </>
    );
  }
}

export default Profile;
