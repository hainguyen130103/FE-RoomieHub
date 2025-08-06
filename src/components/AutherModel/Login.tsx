import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { TabView, TabPanel } from "primereact/tabview";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import Register from "./Register";
import { loginApi } from "../../services/Userservices";
import { message } from "antd";

const Login = ({ visible, onHide }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [remember, setRemember] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      const res = await loginApi(trimmedEmail, trimmedPassword);

      if (res.data && res.data.token) {
        localStorage.setItem("accessToken", res.data.token);
        message.success("Đăng nhập thành công!", 3);
        onHide?.();
      } else {
        throw new Error("Token not received from server");
      }
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.", 3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      closable
      className="p-0 rounded-xl overflow-hidden bg-white"
      style={{ width: "420px" }}
      header={null}
      modal
      maskClassName="custom-blur-overlay"
    >
      <div className="px-6 pt-4 pb-6">
        <div className="text-center mb-4">
          <img src="/logo.svg" alt="RoomieHub" className="h-8 mx-auto mb-1" />
          <h2 className="text-2xl font-semibold">Đăng nhập</h2>
          <p className="text-sm text-gray-600 mt-5">
            Chào mừng bạn đã trở lại <span className="text-base">🖐️</span>
          </p>
        </div>

        <TabView
          activeIndex={tabIndex}
          onTabChange={(e) => setTabIndex(e.index)}
          className="custom-tabview border-b border-gray-200"
          pt={{
            nav: { className: "flex justify-around" },
            inkbar: { className: "hidden" },
          }}
        >
          <TabPanel
            header={
              <span
                className={`${
                  tabIndex === 0
                    ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                    : "text-gray-500"
                } font-medium`}
              >
                Tài khoản
              </span>
            }
          >
            <div className="flex items-center gap-2 mb-3 mt-10">
              <InputText
                placeholder="Tên tài khoản (email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 h-14 pl-4 border border-gray-300 rounded-xl"
              />
            </div>

            <Password
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              className="w-full mb-3 border border-gray-300 rounded-xl"
              inputClassName="text-sm"
              panelClassName="hidden"
              pt={{
                root: { className: "relative w-full" },
                input: { className: "w-86 h-14 pr-12 pl-4" },
                icon: {
                  className:
                    "absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg",
                },
              }}
            />

            <div className="flex justify-between items-center mb-3 text-sm">
              <div className="flex items-center gap-2 h-6">
                <Checkbox
                  inputId="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.checked ?? false)}
                  pt={{
                    root: { className: "flex items-center" },
                    box: { className: "w-5 h-5 border-gray-400 rounded" },
                    icon: { className: "text-white text-xs" },
                  }}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-800 cursor-pointer leading-none"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <a href="#" className="text-blue-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <Button
              label={loading ? "Đang xử lý..." : "Tiếp theo"}
              className="w-full bg-orange-500 border-orange-500 text-white font-semibold h-12 rounded-xl"
              onClick={handleLogin}
              disabled={!email || !password || loading}
            />
          </TabPanel>
        </TabView>

        <div className="text-center text-sm mt-4">
          Bạn chưa có tài khoản?{" "}
          <a
            onClick={() => setShowRegister(true)}
            className="text-orange-500 font-semibold cursor-pointer"
          >
            Đăng ký ngay
          </a>
        </div>
        <Register
          visible={showRegister}
          onHide={() => setShowRegister(false)}
        />

        <div className="flex items-center gap-2 my-5">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">hoặc đăng nhập bằng</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            icon="pi pi-google"
            label="Google"
            iconPos="left"
            className="border border-gray-300 w-[160px] h-11 rounded-xl pl-3 gap-2"
          />
          <Button
            icon="pi pi-facebook"
            label="Facebook"
            iconPos="left"
            className="border border-gray-300 w-[160px] h-11 rounded-xl pl-3 gap-2"
          />
        </div>

        <p className="text-center text-xs text-gray-500 mt-6 leading-snug">
          Bạn gặp khó khăn khi tạo tài khoản?
          <br />
          Vui lòng gọi tới số{" "}
          <span className="font-semibold">012 34567890</span> (Giờ hành chính)
        </p>
      </div>
    </Dialog>
  );
};

export default Login;
