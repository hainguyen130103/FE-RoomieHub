import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  const layoutStyle = {
    display: "flex"
  };

  const mainContentStyle = {
    marginLeft: "240px",
    width: "100%"
  };

  const mainStyle = {
    padding: "24px",
    background: "linear-gradient(135deg, #fff5f0, #ffe4d6)",
    minHeight: "100vh"
  };

  return (
    <div style={layoutStyle}>
      <AdminSidebar />
      <div style={mainContentStyle}>
        <AdminNavbar />
        <main style={mainStyle}>{children}</main>
      </div>
    </div>
  );
}
