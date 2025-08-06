import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import bannerSearch from "../../assets/images/banner-search.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const shortcutItems = [
    {
      icon: "pi pi-eye",
      label: "Xem nhà bằng VR",
      color: "#C23AFA",
      command: () => navigate("/real-estate"),
    },
    {
      icon: "pi pi-home",
      label: "Bất động sản hot",
      color: "#0FC0B5",
      command: () => navigate("/real-estate"),
    },
    {
      icon: "pi pi-users",
      label: "Cộng đồng",
      color: "#3B82F6",
      command: () => navigate("/roommates-post"),
    },
    {
      icon: "pi pi-calendar",
      label: "Tôi là chủ nhà",
      color: "#C23AFA",
      command: () => navigate("/add-apartment"),
    },
    {
      icon: "pi pi-book",
      label: "Kho tri thức",
      color: "linear-gradient(92deg,#5C00FF 0%,#C2A0FF 100%)",
    },
  ];

  return (
    <section className="relative bg-[#f9fafb] py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Shortcut Menu */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
              {shortcutItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={item.command}
                  className="flex items-center gap-3 group cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-white"
                    style={{ background: item.color }}
                  >
                    <i className={item.icon}></i>
                  </div>
                  <span className="text-sm font-medium text-gray-800 group-hover:underline">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column: Tabs + Search + Banner */}
          <div className="w-full lg:w-3/4 space-y-4">
            {/* Background Section with Tabs & Search */}
            <div
              className="rounded-lg p-4 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  'url("/website/static/media/interior_home.3c954f4ac431efe4000d.png")',
                backgroundColor: "rgba(0,0,0,0.4)",
                backgroundBlendMode: "darken",
                height: "150px",
              }}
            >
              {/* Tab Buttons */}
              <div className="flex justify-center gap-3 mb-4">
                {[
                  { label: "Bất động sản", icon: "pi pi-home", index: 0 },
                  { label: "Kho tri thức", icon: "pi pi-book", index: 1 },
                ].map((tab) => (
                  <Button
                    key={tab.index}
                    label={tab.label}
                    icon={tab.icon}
                    onClick={() => setActiveIndex(tab.index)}
                    className={`font-medium px-4 py-2 rounded-md gap-2 ${
                      activeIndex === tab.index
                        ? "bg-orange-500 text-white"
                        : "bg-[#3f3f46] text-white"
                    }`}
                  />
                ))}
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-full flex items-center overflow-hidden shadow w-full max-w-4xl mx-auto mt-4">
                <div className="flex items-center px-4 py-2 min-w-[160px] border-r border-gray-200">
                  <i className="pi pi-map-marker text-black mr-2" />
                  <span className="text-gray-900 font-medium">Hồ Chí Minh</span>
                  <i className="pi pi-chevron-down text-gray-500 ml-2 text-sm" />
                </div>
                <InputText
                  placeholder="Tìm kiếm khu vực/ địa chỉ/ loại phòng"
                  className="flex-grow border-none focus:outline-none px-4 text-sm"
                />
                <Button
                  label="Tìm kiếm"
                  icon="pi pi-search"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-none px-5 py-3 gap-2"
                />
              </div>
            </div>

            {/* Banner image */}
            <div className="rounded-lg overflow-hidden shadow-md h-60">
              <img
                src={bannerSearch}
                alt="RoomieHUb Banner"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
