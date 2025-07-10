import React, { useState, useEffect } from "react";
import api from "../axios"; // Đảm bảo đã có file src/axios.js export instance api
import SurveyPopup from "../components/survey/SurveyPopup";

const AccountInfo = () => {
  const [showSurvey, setShowSurvey] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/api/user/me", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setUserName(res.data); // API trả về plain string
      } catch (err) {
        setUserName("Không xác định");
      }
      setLoading(false);
    };
    fetchUserName();
  }, []);

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Thông tin tài khoản</h2>
        <div className="mb-2">
          <span className="font-medium">Tên tài khoản:</span>{" "}
          {loading ? "Đang tải..." : userName}
        </div>
        <button
          className="mt-4 px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 font-semibold"
          onClick={() => setShowSurvey(true)}
        >
          <span className="animate-pulse">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.15" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="5" fill="#fff" opacity="0.3" />
              <circle cx="12" cy="12" r="3" fill="#fff" />
            </svg>
          </span>
          <span>Điền khảo sát Roomie</span>
        </button>
      </div>
      <SurveyPopup visible={showSurvey} onClose={() => setShowSurvey(false)} />
    </>
  );
};

export default AccountInfo;