import React, { useState } from "react";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
// import bannerImage from '../../assets/images/bg-banner.png';

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative bg-orange-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <TabView
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
              className="hero-tabs"
              pt={{
                nav: {
                  className: "bg-white border-none rounded-t-lg pl-2 pr-2",
                },
                inkbar: { className: "bg-orange-500" },
                navContainer: { className: "border-b border-gray-200" },
              }}
            >
              <TabPanel
                header="Tìm kiếm bất động sản"
                leftIcon="pi pi-home"
                headerClassName={
                  activeIndex === 0
                    ? "font-medium text-orange-500"
                    : "text-gray-600"
                }
                pt={{
                  headerAction: { className: "py-3 px-4" },
                }}
              >
                <div className="p-4 bg-white rounded-b-lg shadow-sm">
                  <div className="relative mb-4">
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-search text-gray-400" />
                      <InputText
                        placeholder="Tìm kiếm bất động sản..."
                        className="w-full p-inputtext-sm border border-gray-300 rounded-md"
                      />
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      label="Cho thuê"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Cần bán"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Chung cư"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Đất"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Văn phòng"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                  </div>
                  <Button
                    label="Tìm kiếm"
                    icon="pi pi-search"
                    className="w-full bg-orange-500 border-orange-500 hover:bg-orange-600 font-medium text-white"
                  />
                </div>
              </TabPanel>
              <TabPanel
                header="Tìm kiếm việc làm"
                leftIcon="pi pi-briefcase"
                headerClassName={
                  activeIndex === 1
                    ? "font-medium text-orange-500"
                    : "text-gray-600"
                }
                pt={{
                  headerAction: { className: "py-3 px-4" },
                }}
              >
                <div className="p-4 bg-white rounded-b-lg shadow-sm">
                  <div className="relative mb-4">
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-search text-gray-400" />
                      <InputText
                        placeholder="Tìm kiếm công việc..."
                        className="w-full p-inputtext-sm border border-gray-300 rounded-md"
                      />
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      label="IT/Phần mềm"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Kinh doanh"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Marketing"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Kế toán"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Nhân sự"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                  </div>
                  <Button
                    label="Tìm kiếm"
                    icon="pi pi-search"
                    className="w-full bg-orange-500 border-orange-500 hover:bg-orange-600 font-medium text-white"
                  />
                </div>
              </TabPanel>
              <TabPanel
                header="Khóa trí thức"
                leftIcon="pi pi-book"
                headerClassName={
                  activeIndex === 2
                    ? "font-medium text-orange-500"
                    : "text-gray-600"
                }
                pt={{
                  headerAction: { className: "py-3 px-4" },
                }}
              >
                <div className="p-4 bg-white rounded-b-lg shadow-sm">
                  <div className="relative mb-4">
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-search text-gray-400" />
                      <InputText
                        placeholder="Tìm kiếm khóa học..."
                        className="w-full p-inputtext-sm border border-gray-300 rounded-md"
                      />
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      label="Phát triển kỹ năng"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Bất động sản"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Kinh doanh"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                    <Button
                      label="Công nghệ"
                      className="p-button-sm p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-100"
                    />
                  </div>
                  <Button
                    label="Tìm kiếm"
                    icon="pi pi-search"
                    className="w-full bg-orange-500 border-orange-500 hover:bg-orange-600 font-medium text-white"
                  />
                </div>
              </TabPanel>
            </TabView>

            <div className="mt-8 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
              <a href="#" className="flex flex-col items-center group">
                <div className="bg-white p-2 w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2 group-hover:shadow-md transition-shadow">
                  <i className="pi pi-eye text-orange-500 text-lg"></i>
                </div>
                <span className="text-xs text-center text-gray-700">
                  Xem nhà bằng VR
                </span>
              </a>
              <a href="#" className="flex flex-col items-center group">
                <div className="bg-white p-2 w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2 group-hover:shadow-md transition-shadow">
                  <i className="pi pi-file text-orange-500 text-lg"></i>
                </div>
                <span className="text-xs text-center text-gray-700">
                  Tạo CV bằng AI
                </span>
              </a>
              <a href="#" className="flex flex-col items-center group">
                <div className="bg-white p-2 w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2 group-hover:shadow-md transition-shadow">
                  <i className="pi pi-building text-orange-500 text-lg"></i>
                </div>
                <span className="text-xs text-center text-gray-700">
                  Doanh nghiệp xuất sắc
                </span>
              </a>
              <a href="#" className="flex flex-col items-center group">
                <div className="bg-white p-2 w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2 group-hover:shadow-md transition-shadow">
                  <i className="pi pi-home text-orange-500 text-lg"></i>
                </div>
                <span className="text-xs text-center text-gray-700">
                  Bất động sản hot
                </span>
              </a>
              <a href="#" className="flex flex-col items-center group">
                <div className="bg-white p-2 w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2 group-hover:shadow-md transition-shadow">
                  <i className="pi pi-users text-orange-500 text-lg"></i>
                </div>
                <span className="text-xs text-center text-gray-700">
                  Cộng đồng
                </span>
              </a>
              <a href="#" className="flex flex-col items-center group">
                <div className="bg-white p-2 w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2 group-hover:shadow-md transition-shadow">
                  <i className="pi pi-calendar text-orange-500 text-lg"></i>
                </div>
                <span className="text-xs text-center text-gray-700">
                  Tài liệu chủ nhà
                </span>
              </a>
              <a href="#" className="flex flex-col items-center group">
                <div className="bg-white p-2 w-12 h-12 flex items-center justify-center rounded-full shadow-sm mb-2 group-hover:shadow-md transition-shadow">
                  <i className="pi pi-book text-orange-500 text-lg"></i>
                </div>
                <span className="text-xs text-center text-gray-700">
                  Khóa trí thức
                </span>
              </a>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-end">
            <div className="relative rounded-lg overflow-hidden shadow-lg max-w-md">
              <img
                src="https://ext.same-assets.com/662425795/2179942551.png"
                alt="FIDOVN Banner"
                className="w-full h-auto"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <a
                  href="#"
                  className="block bg-orange-500 text-white text-center py-2 px-4 rounded-md hover:bg-orange-600 transition-colors font-medium"
                >
                  NHẬN CÚ ĐÚP THƯƠNG HIỆU
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
