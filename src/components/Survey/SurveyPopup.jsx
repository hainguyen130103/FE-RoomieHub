import React, { useState } from "react";
import { createSurveyApi } from "../../services/Userservices"; // Sử dụng service giống RealEstateSection

const defaultSurvey = {
  birthYear: "",
  userName: "",
  hometown: "",
  gender: "MALE",
  occupation: "STUDENT",
  priceRange: "BELOW_3M",
  currentLatitude: "",
  currentLongitude: "",
  preferredLocation: "NEAR_UNIVERSITY",
  smoking: "NO",
  pets: "NO",
  cookFrequency: "NEVER",
  sleepHabit: "EARLY_SLEEPER",
  inviteFriends: "NO",
  price: "",
  area: "",
  genderRequiment: "MALE",
  deposit: "",
  utilities: "BASIC",
  furniture: "BASIC",
  location: ""
};

const SurveyPopup = ({ visible, onClose }) => {
  const [survey, setSurvey] = useState(defaultSurvey);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      // Dữ liệu mẫu giống Postman/cURL
      const sampleData = {
        birthYear: 1073741824,
        userName: "string",
        hometown: "HANOI",
        gender: "MALE",
        occupation: "STUDENT",
        priceRange: "BELOW_3M",
        currentLatitude: 0.1,
        currentLongitude: 0.1,
        preferredLocation: "NEAR_UNIVERSITY",
        smoking: "YES",
        pets: "YES",
        cookFrequency: "NEVER",
        sleepHabit: "EARLY_SLEEPER",
        inviteFriends: "YES",
        price: 0.1,
        area: 0.1,
        genderRequiment: "MALE",
        deposit: 0.1,
        utilities: "BASIC",
        furniture: "BASIC",
        location: "string"
      };
      await createSurveyApi(sampleData, token);
      setSuccess(true);
      setSurvey(defaultSurvey);
    } catch (err) {
      let msg = "Có lỗi xảy ra khi gửi khảo sát!";
      if (err.response) {
        msg += `\nStatus: ${err.response.status}\n${JSON.stringify(err.response.data)}`;
      } else if (err.request) {
        msg += "\nKhông nhận được phản hồi từ server.";
      } else {
        msg += `\n${err.message}`;
      }
      setError(msg);
      console.error("Survey API error:", err);
    }
    setLoading(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-indigo-600">Khảo sát Roomie AI</h3>
        {success && (
          <div className="mb-3 text-green-600 font-semibold">Gửi khảo sát thành công!</div>
        )}
        {error && (
          <div className="mb-3 text-red-600 whitespace-pre-line">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {/* Cột 1 */}
          <div className="space-y-3">
            <input
              className="w-full border rounded px-3 py-2"
              name="userName"
              placeholder="Tên của bạn (vd: Nguyễn Văn A)"
              value={survey.userName}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border rounded px-3 py-2"
              name="birthYear"
              placeholder="Năm sinh (vd: 2000)"
              type="number"
              value={survey.birthYear}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border rounded px-3 py-2"
              name="hometown"
              placeholder="Quê quán (vd: HANOI)"
              value={survey.hometown}
              onChange={handleChange}
            />
            <select
              className="w-full border rounded px-3 py-2"
              name="gender"
              value={survey.gender}
              onChange={handleChange}
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
            <select
              className="w-full border rounded px-3 py-2"
              name="occupation"
              value={survey.occupation}
              onChange={handleChange}
            >
              <option value="STUDENT">Sinh viên</option>
              <option value="OFFICER">Nhân viên văn phòng</option>
              <option value="OTHER">Khác</option>
            </select>
            <select
              className="w-full border rounded px-3 py-2"
              name="priceRange"
              value={survey.priceRange}
              onChange={handleChange}
            >
              <option value="BELOW_3M">Dưới 3 triệu</option>
              <option value="FROM_3M_TO_5M">3-5 triệu</option>
              <option value="FROM_5M_TO_7M">5-7 triệu</option>
              <option value="ABOVE_7M">Trên 7 triệu</option>
            </select>
            <input
              className="w-full border rounded px-3 py-2"
              name="currentLatitude"
              placeholder="Vĩ độ hiện tại (vd: 21.0285)"
              type="number"
              value={survey.currentLatitude}
              onChange={handleChange}
            />
            <input
              className="w-full border rounded px-3 py-2"
              name="currentLongitude"
              placeholder="Kinh độ hiện tại (vd: 105.8542)"
              type="number"
              value={survey.currentLongitude}
              onChange={handleChange}
            />
            <select
              className="w-full border rounded px-3 py-2"
              name="preferredLocation"
              value={survey.preferredLocation}
              onChange={handleChange}
            >
              <option value="NEAR_UNIVERSITY">Gần trường đại học</option>
              <option value="NEAR_OFFICE">Gần công ty/văn phòng</option>
              <option value="CITY_CENTER">Trung tâm thành phố</option>
              <option value="OTHER">Khác</option>
            </select>
            <select
              className="w-full border rounded px-3 py-2"
              name="smoking"
              value={survey.smoking}
              onChange={handleChange}
            >
              <option value="NO">Không hút thuốc</option>
              <option value="YES">Có hút thuốc</option>
            </select>
            <select
              className="w-full border rounded px-3 py-2"
              name="pets"
              value={survey.pets}
              onChange={handleChange}
            >
              <option value="NO">Không nuôi thú cưng</option>
              <option value="YES">Có nuôi thú cưng</option>
            </select>
          </div>
          {/* Cột 2 */}
          <div className="space-y-3">
            <select
              className="w-full border rounded px-3 py-2"
              name="cookFrequency"
              value={survey.cookFrequency}
              onChange={handleChange}
            >
              <option value="NEVER">Không nấu ăn</option>
              <option value="SOMETIMES">Thỉnh thoảng</option>
              <option value="OFTEN">Thường xuyên</option>
            </select>
            <select
              className="w-full border rounded px-3 py-2"
              name="sleepHabit"
              value={survey.sleepHabit}
              onChange={handleChange}
            >
              <option value="EARLY_SLEEPER">Ngủ sớm</option>
              <option value="LATE_SLEEPER">Ngủ muộn</option>
            </select>
            <select
              className="w-full border rounded px-3 py-2"
              name="inviteFriends"
              value={survey.inviteFriends}
              onChange={handleChange}
            >
              <option value="NO">Không mời bạn về phòng</option>
              <option value="YES">Có mời bạn về phòng</option>
            </select>
            <input
              className="w-full border rounded px-3 py-2"
              name="price"
              placeholder="Giá mong muốn (triệu đồng, vd: 3.5)"
              type="number"
              value={survey.price}
              onChange={handleChange}
            />
            <input
              className="w-full border rounded px-3 py-2"
              name="area"
              placeholder="Diện tích mong muốn (m2, vd: 20)"
              type="number"
              value={survey.area}
              onChange={handleChange}
            />
            <select
              className="w-full border rounded px-3 py-2"
              name="genderRequiment"
              value={survey.genderRequiment}
              onChange={handleChange}
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="ANY">Không yêu cầu</option>
            </select>
            <input
              className="w-full border rounded px-3 py-2"
              name="deposit"
              placeholder="Tiền cọc mong muốn (triệu đồng, vd: 1)"
              type="number"
              value={survey.deposit}
              onChange={handleChange}
            />
            <select
              className="w-full border rounded px-3 py-2"
              name="utilities"
              value={survey.utilities}
              onChange={handleChange}
            >
              <option value="BASIC">Cơ bản</option>
              <option value="FULL">Đầy đủ</option>
            </select>
            <select
              className="w-full border rounded px-3 py-2"
              name="furniture"
              value={survey.furniture}
              onChange={handleChange}
            >
              <option value="BASIC">Cơ bản</option>
              <option value="FULL">Đầy đủ</option>
            </select>
            <input
              className="w-full border rounded px-3 py-2"
              name="location"
              placeholder="Địa chỉ cụ thể (vd: 123 Nguyễn Trãi, Hà Nội)"
              value={survey.location}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded font-semibold mt-2"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi khảo sát"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyPopup;