import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef, useState } from "react";
import logoImage from "../../assets/images/logo.svg";
import Login from "../AutherModel/Login";
import Register from "../AutherModel/Register";
import { Link } from "react-router-dom";


const Header = () => {
  const op = useRef(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cập nhật trạng thái login khi mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    op.current?.hide();
    alert("Đã đăng xuất");
  };

  const items = [
    {
      label: "Công việc",
      icon: "pi pi-briefcase",
      className: "text-white font-medium",
    },
    {
      label: "Bất động sản",
      icon: "pi pi-home",
      className: "text-white font-medium",
    },
    {
      label: "Kho tri thức",
      icon: "pi pi-book",
      className: "text-white font-medium",
    },
    {
      label: "Tin mới nhất",
      icon: "pi pi-clock",
      className: "text-white font-medium",
    },
  ];

  const start = (
    <div className="flex items-center gap-2">
      <Link to="/">
        <img
          src={logoImage}
          alt="Logo"
          className="h-7 ml-20 mr-20 cursor-pointer hover:scale-105 transition-transform"
        />
      </Link>
    </div>
  );

  const end = (
    <div className="flex items-center gap-3">
      <button className="w-9 h-9 flex items-center justify-center rounded-full border border-white text-white">
        <i className="pi pi-globe text-lg"></i>
      </button>
      <Button
        label="Đăng tin"
        icon="pi pi-pencil"
        className="bg-orange-500 hover:bg-orange-600 border-none text-white font-semibold px-4 py-2 rounded-md gap-2"
      />
      <div>
        <div
          className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center cursor-pointer"
          onClick={(e) => op.current.toggle(e)}
        >
          <i className="pi pi-user text-white text-lg" />
        </div>

        <OverlayPanel ref={op} className="w-60 shadow-md rounded-md bg-white">
          <ul className="p-2">
            {!isLoggedIn ? (
              <>
                <li
                  onClick={() => {
                    setShowLogin(true);
                    op.current?.hide();
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  <i className="pi pi-sign-in text-gray-500" />
                  <span>Đăng nhập</span>
                </li>

                <li
                  onClick={() => {
                    setShowRegister(true);
                    op.current?.hide();
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  <i className="pi pi-user-plus text-gray-500" />
                  <span>Đăng ký</span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-gray-900"
                    onClick={() => op.current?.hide()}
                  >
                    <i className="pi pi-user text-gray-500" />
                    <span>Thông tin tài khoản</span>
                  </Link>
                </li>
              </>
            )}

            <hr className="my-2" />

            <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <i className="pi pi-pencil text-gray-500" />
              <span>Đăng tin lên ROOMIEHUB</span>
            </li>

            <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <i className="pi pi-question-circle text-gray-500" />
              <span>Hỗ trợ</span>
            </li>

            {isLoggedIn && (
              <li
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-red-500"
              >
                <i className="pi pi-sign-out" />
                <span>Đăng xuất</span>
              </li>
            )}
          </ul>
        </OverlayPanel>

        <Login
          visible={showLogin}
          onHide={() => {
            setShowLogin(false);
            setIsLoggedIn(true); // update sau khi login thành công
          }}
        />
        <Register
          visible={showRegister}
          onHide={() => setShowRegister(false)}
        />
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#18181b] px-6 shadow-md">
      <Menubar
        model={items}
        start={start}
        end={end}
        className="border-none bg-[#18181b] text-white h-[76px] items-center"
        pt={{
          menuitem: { className: "mx-3" },
          icon: { className: "mr-2" },
        }}
      />
    </header>
  );
};

export default Header;
