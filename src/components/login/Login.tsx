import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { TabView, TabPanel } from "primereact/tabview";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const Login = ({ visible, onHide }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [remember, setRemember] = useState(false);
  const countries = [
    { label: "+84", value: "+84" },
    { label: "+1", value: "+1" },
    { label: "+61", value: "+61" },
  ];

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      closable={true}
      className="p-0 rounded-xl overflow-hidden bg-white"
      style={{ width: "420px" }}
      header={null}
    >
      <div className="px-6 pt-4 pb-6">
        {/* Header Logo + Title */}
        <div className="text-center mb-4">
          <img src="/logo.svg" alt="RoomieHub" className="h-8 mx-auto mb-1" />
          <h2 className="text-2xl font-semibold">Đăng nhập</h2>
          <p className="text-sm text-gray-600">
            Chào mừng bạn đã trở lại <span className="text-base">🖐️</span>
          </p>
        </div>

        {/* Tabs */}
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
                Số điện thoại
              </span>
            }
          >
            <div className="flex items-center gap-2 mb-3">
              <Dropdown
                options={countries}
                value={countries[0].value}
                className="w-[100px] h-14 border border-gray-300 rounded-xl"
              />
              <InputText
                placeholder="Số điện thoại"
                className="w-full h-14 border border-gray-300 rounded-xl"
              />
            </div>
            <Password
              placeholder="Nhập mật khẩu"
              toggleMask
              feedback={false}
              className="w-full mb-3 h-14 border border-gray-300 rounded-xl"
              inputClassName="h-full"
            />
            <div className="flex justify-between items-center mb-3 text-sm">
              <div className="flex items-center gap-2">
                <Checkbox
                  inputId="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.checked ?? false)}
                />
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
              <a href="#" className="text-blue-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <Button
              label="Tiếp theo"
              className="w-full bg-gray-100 text-gray-500 font-semibold border-none h-12 rounded-xl"
              disabled
            />
          </TabPanel>

          <TabPanel
            header={
              <span
                className={`${tabIndex === 1 ? "text-orange-500 border-b-2 border-orange-500 pb-1" : "text-gray-500"} font-medium`}
              >
                Email
              </span>
            }
          >
            <InputText
              placeholder="Email"
              className="w-full mb-3 h-14 border border-gray-300 rounded-xl"
            />
            <Password
              placeholder="Nhập mật khẩu"
              toggleMask
              feedback={false}
              className="w-full mb-3 h-14 border border-gray-300 rounded-xl"
              inputClassName="h-full"
            />
            <Button
              label="Tiếp theo"
              className="w-full bg-orange-500 border-orange-500 text-white font-semibold h-12 rounded-xl"
            />
          </TabPanel>
        </TabView>

        {/* Đăng ký link */}
        <div className="text-center text-sm mt-4">
          Bạn chưa có tài khoản?{" "}
          <a href="#" className="text-orange-500 font-semibold">
            Đăng ký ngay
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">hoặc đăng nhập bằng</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Social buttons */}
        <div className="flex justify-center gap-4">
          <Button
            icon="pi pi-google"
            label="Google"
            className="border border-gray-300 w-[160px] h-11 rounded-xl"
          />
          <Button
            icon="pi pi-facebook"
            label="Facebook"
            className="border border-gray-300 w-[160px] h-11 rounded-xl"
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6 leading-snug">
          Bạn gặp khó khăn khi tạo tài khoản?
          <br />
          Vui lòng gọi tới số{" "}
          <span className="font-semibold">028 62873344</span> (Giờ hành chính)
        </p>
      </div>
    </Dialog>
  );
};

export default Login;
