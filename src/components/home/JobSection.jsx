import React, { useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

const JobSection = () => {
  const [activeJobTab, setActiveJobTab] = useState(0);

  const jobListings = [
    {
      id: 1,
      title: "Cần tuyển gấp Lập trình viên Mobile",
      company: "Công Ty TNHH RoomieHub",
      location: "Hồ Chí Minh",
      salary: "10 triệu-20 triệu /tháng",
      type: "Bán thời gian",
      experience: "1 năm",
      logo: "https://ext.same-assets.com/662425795/615723269.webp",
      hot: true,
      urgent: true,
    },
    {
      id: 2,
      title: "NHÂN VIÊN KINH DOANH - Data sẵn có",
      company: "CÔNG TY TNHH VẬT TƯ THIẾT BỊ ĐẠI QUANG MINH",
      location: "Hà Nội",
      salary: "Thỏa thuận",
      type: "Bán thời gian",
      experience: "1 năm",
      logo: "https://ext.same-assets.com/662425795/2322114180.png",
      hot: true,
      urgent: false,
    },
    {
      id: 3,
      title: "NHÂN VIÊN KINH DOANH/ THỰC TẬP SINH - KINH DOANH ONLINE",
      company: "LLQ INVEST TRADING COMPANY LIMITED",
      location: "Hồ Chí Minh",
      salary: "Thỏa thuận",
      type: "Bán thời gian",
      experience: "Không yêu cầu",
      logo: "https://ext.same-assets.com/662425795/2309632663.jpeg",
      hot: true,
      urgent: true,
    },
    {
      id: 4,
      title: "Tuyển dụng Sales Marketing",
      company: "CÔNG TY TNHH THƯƠNG MẠI CNC DANA",
      location: "Đà Nẵng",
      salary: "Thỏa thuận",
      type: "Bán thời gian",
      experience: "Không yêu cầu",
      logo: "https://ext.same-assets.com/662425795/2034329754.jpeg",
      hot: true,
      urgent: true,
    },
    {
      id: 5,
      title: "TUYỂN DỤNG TƯ VẤN VIÊN BẢO HIỂM BẢO VIỆT",
      company: "ĐẠI LÝ BẢO VIỆT NHÂN THỌ SÀI GÒN",
      location: "Hồ Chí Minh",
      salary: "5 triệu-10 triệu /tháng",
      type: "Bán thời gian",
      experience: "Không yêu cầu",
      logo: "https://ext.same-assets.com/662425795/75808339.jpeg",
      hot: true,
      urgent: false,
    },
    {
      id: 6,
      title: "NHÂN VIÊN KINH DOANH THỊ TRƯỜNG",
      company: "CÔNG TY TNHH ĐẦU TƯ THƯƠNG MẠI CHỨC VIỆT NAM",
      location: "Hà Nội",
      salary: "10 triệu-20 triệu /tháng",
      type: "Bán thời gian",
      experience: "Không yêu cầu",
      logo: "https://ext.same-assets.com/662425795/2556845766.png",
      hot: true,
      urgent: true,
    },
  ];

  const jobCategories = [
    "Tất cả",
    "Kinh doanh, bán hàng",
    "Marketing/PR/Quảng cáo",
    "Dịch vụ khách hàng/Vận hành",
    "Nhân sự/Hành chính/Pháp chế",
    "Tài chính/Ngân hàng/Bảo hiểm",
    "Công nghệ Thông tin",
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Những công việc nổi bật
        </h2>

        <div className="mb-6 overflow-x-auto scrollbar-thin">
          <div className="flex space-x-2 pb-1">
            {jobCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveJobTab(index)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-colors ${
                  index === activeJobTab
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobListings.map((job) => (
            <Card
              key={job.id}
              className="p-0 mb-4 rounded-lg border border-transparent t hover:border-orange-500  hover:shadow-lg transition-all bg-white"
            >
              <div className="p-4">
                <div className="flex items-start">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-12 h-12 object-contain rounded-md border border-gray-200 mr-3 bg-white p-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold mb-1 line-clamp-2 text-gray-800 hover:text-orange-500 transition-colors">
                        <a href="#">{job.title}</a>
                      </h3>
                      {job.hot && (
                        <Tag value="HOT" severity="danger" className="ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                      {job.company}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="pi pi-money-bill mr-1.5 text-gray-500"></i>
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-map-marker mr-1.5 text-gray-500"></i>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-clock mr-1.5 text-gray-500"></i>
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="pi pi-briefcase mr-1.5 text-gray-500"></i>
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    {job.urgent && (
                      <Tag
                        value="Tuyển gấp"
                        severity="warning"
                        className="mt-2"
                        icon="pi pi-bolt"
                        pt={{
                          root: {
                            className:
                              "bg-amber-50 text-amber-600 border border-amber-200 font-medium",
                          },
                          icon: { className: "text-amber-500" },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            label="Xem thêm về việc làm"
            className="p-button-outlined border-orange-500 text-orange-500 hover:bg-orange-50"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
      </div>
    </section>
  );
};

export default JobSection;
