// src/pages/OAuth2Success.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

const OAuth2Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Lưu token
      localStorage.setItem("accessToken", token);

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        message.success("Đăng nhập Google thành công!", 3);

        if (decoded.role === "ADMIN") {
          navigate("/admin"); // Nếu là admin thì vào trang admin
        } else {
          navigate("/"); // Nếu user thì về homepage
        }
      } catch (err) {
        console.error("Decode token error:", err);
        message.error("Token không hợp lệ!", 3);
        navigate("/login");
      }
    } else {
      message.error("Không nhận được token!", 3);
      navigate("/login");
    }
  }, [navigate]);

  return <p className="text-center mt-10">Đang xử lý đăng nhập Google...</p>;
};

export default OAuth2Success;
