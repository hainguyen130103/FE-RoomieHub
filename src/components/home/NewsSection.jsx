import React from "react";
import { Card } from "primereact/card";

const NewsSection = () => {
  const news = [
    {
      id: 1,
      title:
        "Toyar và Realsee hợp tác chiến lược số hóa không gian tại Việt Nam thông qua ROOMIEHUB",
      source: "Thanh Niên",
      date: "19/07/2025",
      time: "16:30 GMT+7",
      link: "https://thanhnien.vn/",
    },
    {
      id: 2,
      title:
        "Công nghệ 5.0 mở ra cơ hội số hóa bất động sản và nhân lực tại Thủ Đức Innovation Fest 2024",
      source: "HTV",
      date: "18/07/2025",
      time: "11:43 GMT+7",
      link: "https://www.htv.com.vn/",
    },
    {
      id: 3,
      title:
        "Toyar hợp tác Realsee, số hóa không gian tại VN qua nền tảng ROOMIEHUB",
      source: "Znews",
      date: "19/18/2025",
      time: "17:00 GMT+7",
      link: "https://znews.vn/",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Báo chí viết gì về chúng tôi?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card
              key={item.id}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3">
                <h3 className="text-lg font-bold mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium">{item.source}</span>
                  <a
                    href={item.link}
                    className="text-orange-500 hover:text-orange-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <div className="bg-orange-50 rounded-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <div className="font-bold text-orange-500 mb-2">ROOMIEHUB</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  NHẬN ĐƯỢC SỰ QUÂN TÂM TỪ SINH VIÊN FPT
                </h2>
                <div className="text-gray-700 mb-4">
                  <p className="mb-2">
                    <strong>TOP</strong> thương hiệu có khả năng dẫn đầu 2025
                  </p>
                  <p>
                    <strong>TOP</strong> môi trường tìm kiếm tốt nhất
                  </p>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                  Xem thêm
                </button>
              </div>
              <div className="md:w-1/3">
                <img
                  src="https://ext.same-assets.com/662425795/1751059349.png"
                  alt="ROOMIEHUB Award"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
