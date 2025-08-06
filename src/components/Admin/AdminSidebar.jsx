import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { message } from "antd";

const menuItems = [
  { label: "Dashboard", icon: <HomeOutlined />, to: "/admin" },
  { label: "Quản lý người dùng", icon: <UserOutlined />, to: "/admin/users" },
  { label: "Quản lý bài đăng", icon: <FileTextOutlined />, to: "/admin/posts" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    message.success("Đã đăng xuất!");
    navigate("/"); // chuyển về trang chủ
  };

  return (
    <div className="bg-gray-800 text-white w-60 min-h-screen fixed left-0 top-0 shadow-lg z-50">
      <div className="text-2xl font-bold px-6 py-4 border-b border-gray-700">
        Admin Panel
      </div>
      <ul className="mt-4">
        {menuItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              <span className="mr-3">{item.icon}</span> {item.label}
            </NavLink>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 w-full hover:bg-gray-700"
          >
            <LogoutOutlined className="mr-3" />
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}
