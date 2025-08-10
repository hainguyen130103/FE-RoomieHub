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

  const sidebarStyle = {
    background: "linear-gradient(180deg, #ff8c00, #ff6600)",
    color: "white",
    width: "240px",
    minHeight: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    boxShadow: "0 4px 20px rgba(255,140,0,0.4)",
    zIndex: 50
  };

  const headerStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    padding: "20px 24px",
    borderBottom: "2px solid rgba(255,255,255,0.3)",
    background: "rgba(0,0,0,0.1)",
    textAlign: "center",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)"
  };

  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    padding: "15px 24px",
    textDecoration: "none",
    color: "white",
    transition: "all 0.3s ease",
    borderLeft: "4px solid transparent",
    fontWeight: "500"
  };

  const activeMenuItemStyle = {
    ...menuItemStyle,
    background: "rgba(255,255,255,0.2)",
    borderLeft: "4px solid white",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)"
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    padding: "15px 24px",
    width: "100%",
    border: "none",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left"
  };

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        Admin Panel
      </div>
      <ul style={{ marginTop: "16px", listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              style={({ isActive }) => 
                isActive ? activeMenuItemStyle : menuItemStyle
              }
              onMouseEnter={(e) => {
                if (!e.target.closest('a').classList.contains('active')) {
                  e.target.closest('a').style.background = "rgba(255,255,255,0.1)";
                  e.target.closest('a').style.transform = "translateX(5px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.closest('a').classList.contains('active')) {
                  e.target.closest('a').style.background = "transparent";
                  e.target.closest('a').style.transform = "translateX(0)";
                }
              }}
            >
              <span style={{ marginRight: "12px", fontSize: "16px" }}>{item.icon}</span> 
              {item.label}
            </NavLink>
          </li>
        ))}
        <li style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "20px" }}>
          <button
            onClick={handleLogout}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,0,0,0.2)";
              e.target.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateX(0)";
            }}
          >
            <LogoutOutlined style={{ marginRight: "12px", fontSize: "16px" }} />
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}
