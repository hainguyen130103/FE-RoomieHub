export default function AdminNavbar() {
  const navbarStyle = {
    background: "linear-gradient(90deg, #fff5f0, #ffe4d6)",
    boxShadow: "0 2px 10px rgba(255,140,0,0.3)",
    padding: "16px 24px",
    position: "sticky",
    top: 0,
    left: "240px",
    right: 0,
    zIndex: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ffcc99",
    borderTop: "3px solid #ff8c00"
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ff6600",
    textShadow: "0 1px 2px rgba(255,140,0,0.3)"
  };

  const greetingStyle = {
    color: "#ff8c00",
    fontSize: "16px",
    fontWeight: "500",
    background: "rgba(255,140,0,0.1)",
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid #ffcc99"
  };

  return (
    <div style={navbarStyle}>
      <h1 style={titleStyle}>Trang quản trị</h1>
      <div style={greetingStyle}>Xin chào, Admin!</div>
    </div>
  );
}
