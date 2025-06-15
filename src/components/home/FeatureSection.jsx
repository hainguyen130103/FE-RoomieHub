import React from "react";
import { Card } from "primereact/card";

const FeatureSection = ({ title, type }) => {
  const jobFeatures = [
    {
      icon: "/src/assets/images/icon-create-cv.png",
      title: "Các mẫu CV được thiết kế chuyên nghiệp",
      description:
        "Tạo CV bằng các mẫu được thiết kế đẹp mắt và phù hợp với nhiều ngành nghề, giúp bạn tiết kiệm thời gian và công sức trong quá trình tạo CV",
    },
    {
      icon: "/src/assets/images/icon-avatar.png",
      title: "Tạo avatar cho CV bằng AI",
      description:
        "Tạo avatar cho CV bằng AI, giúp cá nhân hóa hồ sơ và tạo ấn tượng mạnh mẽ với nhà tuyển dụng",
    },
    {
      icon: "/src/assets/images/icon-language.png",
      title: "Các mẫu CV hỗ trợ đa ngôn ngữ",
      description:
        "Các mẫu CV được hỗ trợ đa ngôn ngữ, giúp bạn dễ dàng tạo CV bằng nhiều ngôn ngữ khác nhau, phù hợp với nhu cầu ứng tuyển quốc tế",
    },
  ];

  const realEstateFeatures = [
    {
      icon: "/src/assets/images/icon-vr.png",
      title: "Xem nhà bằng VR",
      description:
        "Thay vì phải xem lần lượt từng hình ảnh hoặc video, ROOMIEHUB giúp người dùng có thể quan sát toàn bộ không gian chỉ trong một lần chạm",
    },
    {
      icon: "/src/assets/images/icon-filter.png",
      title: "Bộ lọc đa dạng",
      description:
        "Với hơn 40+ bộ lọc và từ khóa tùy chỉnh, ROOMIEHUB có thể giúp bạn dễ dàng tìm được căn hộ cho thuê dành cho bạn",
    },
    {
      icon: "https://ext.same-assets.com/662425795/3382098666.png",
      title: "Phù hợp mọi nhu cầu",
      description:
        "ROOMIEHUB cung cấp dữ liệu tin rao lớn với đa dạng loại hình bất động sản giúp bạn có những lựa chọn phù hợp với nhu cầu của mình",
    },
  ];

  const features = type === "job" ? jobFeatures : realEstateFeatures;
  const bgClass = type === "job" ? "bg-white" : "bg-gray-50";

  return (
    <section className={`py-14 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="rounded-full p-1 mb-6 inline-block">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
