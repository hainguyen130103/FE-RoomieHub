import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { registerApi } from "../../services/Userservices";

const Register = ({ visible, onHide }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    try {
      setLoading(true);
      const res = await registerApi(
        email.trim(),
        password.trim(),
        fullname.trim()
      );
      console.log("Register success:", res);
      onHide?.();
    } catch (error) {
      console.error("Register failed:", error?.response?.data || error.message);
      alert("Đăng ký thất bại. Vui lòng thử lại.");
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
          <h2 className="text-2xl font-semibold">Đăng ký</h2>
          <p className="text-sm text-gray-600 mt-5">
            Chào mừng bạn đến với chúng tôi{" "}
            <span className="text-base">🖐️</span>
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
                className={`${tabIndex === 0 ? "text-orange-500 border-b-2 border-orange-500 pb-1" : "text-gray-500"} font-medium`}
              >
                Tài khoản
              </span>
            }
          >
            <InputText
              placeholder="Tên đầy đủ"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full mb-3 text-sm h-14 pl-4 border border-gray-300 rounded-xl mt-10"
            />
            <InputText
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 text-sm h-14 pl-4 border border-gray-300 rounded-xl"
            />
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
            <Password
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

            <div className="text-center text-sm mt-4 mb-5">
              <p>Bằng việc đăng ký bạn đã đồng ý với</p>
              <a href="#" className="text-orange-500 font-semibold">
                Điều khoản và điều kiện
              </a>{" "}
              và{" "}
              <a href="#" className="text-orange-500 font-semibold">
                Chính sách bảo mật
              </a>
            </div>

            <Button
              label={loading ? "Đang xử lý..." : "Tiếp theo"}
              onClick={handleRegister}
              className="w-full bg-orange-500 border-orange-500 text-white font-semibold h-12 rounded-xl"
              disabled={
                !email || !fullname || !password || !confirmPassword || loading
              }
            />
          </TabPanel>
        </TabView>

        <div className="text-center text-sm mt-4">
          Bạn đã có tài khoản?{" "}
          <a href="#" className="text-orange-500 font-semibold">
            Đăng nhập ngay
          </a>
        </div>

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

export default Register;
