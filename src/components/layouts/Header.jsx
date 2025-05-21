import { useState } from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import logoImage from "../../assets/images/logo.svg";

const Header = () => {
  const [selectedCity, setSelectedCity] = useState("Ho Chi Minh");

  const cities = [
    { label: "Hồ Chí Minh", value: "Ho Chi Minh" },
    { label: "Hà Nội", value: "Ha Noi" },
    { label: "Đà Nẵng", value: "Da Nang" },
  ];

  const items = [
    {
      label: "Công việc",
      icon: "pi pi-briefcase",
      className: "text-gray-700",
    },
    {
      label: "Bất động sản",
      icon: "pi pi-home",
      className: "text-gray-700",
    },
    {
      label: "Khảo thí thức",
      icon: "pi pi-book",
      className: "text-gray-700",
    },
    {
      label: "Tin mới nhất",
      icon: "pi pi-bell",
      className: "text-gray-700",
    },
  ];

  const start = (
    <div className="flex items-center">
      <img src={logoImage} alt="ROOMIEHUB Logo" className="h-8 mr-4" />
    </div>
  );

  const end = (
    <div className="flex items-center gap-3">
      <Button
        label="Đăng tin"
        icon="pi pi-plus"
        className="p-button-sm bg-orange-500 border-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-2"
      />
      <div className="flex items-center ml-2 border border-gray-200 rounded-full px-3 py-1">
        <i className="pi pi-user text-gray-600 mr-2 text-lg" />
        <span className="text-sm text-gray-600">User</span>
      </div>
    </div>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <Menubar
          model={items}
          start={start}
          end={end}
          className="border-none py-2"
          pt={{
            menu: { className: "p-0" },
            button: { className: "p-0" },
            menuitem: { className: "mx-2" },
          }}
        />
        <div className="flex flex-wrap items-center gap-2 p-3 bg-orange-500 rounded-b-lg text-white">
          <div className="flex space-x-2">
            <Button
              label="Bất động sản"
              icon="pi pi-home"
              className="p-button-sm p-button-secondary bg-white text-orange-500 font-medium border-none hover:bg-gray-100"
            />
            <Button
              label="Việc làm"
              icon="pi pi-briefcase"
              className="p-button-sm p-button-text text-white border border-white hover:bg-orange-600"
            />
          </div>
          <div className="ml-auto flex items-center">
            <Dropdown
              value={selectedCity}
              options={cities}
              onChange={(e) => setSelectedCity(e.value)}
              className="p-inputtext-sm bg-white text-gray-700 rounded-l-md border-none min-w-[120px]"
              pt={{
                root: { className: "h-[36px]" },
                input: { className: "h-[36px] py-1 px-3" },
              }}
            />
            <span className="p-input-icon-right bg-white rounded-r-md h-[36px]">
              <i className="pi pi-search text-gray-500" />
              <InputText
                placeholder="Tìm kiếm..."
                className="p-inputtext-sm border-none h-[36px] py-1 px-3"
              />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
