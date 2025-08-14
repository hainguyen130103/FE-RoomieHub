import React, { useState, useEffect } from "react";
import { getAllApartmentsApi } from "../../services/Userservices";
import { useNavigate } from "react-router-dom";

import { Tag, Button } from "antd";
import {
  FileTextOutlined,
  EnvironmentOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const RealEstateSection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await getAllApartmentsApi();
        setProperties(response.data || []);
      } catch (err) {
        setError("Không thể tải danh sách bất động sản.");
        console.error("Lỗi khi lấy bất động sản:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/real-estate/${id}`);
  };

  if (loading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800">
          Phòng/Nhà đang cho thuê
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id}>
              <div
                onClick={() => handleCardClick(property.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer select-none"
                style={{
                  minHeight: 350,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="relative overflow-hidden rounded-t-lg h-48">
                  <img
                    src={property.imageBase64List?.[0] || "/default-image.jpg"}
                    alt={property.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  {property.hasVR && (
                    <Tag
                      icon={<EyeOutlined />}
                      color="#1890ff"
                      className="absolute top-3 left-3 font-semibold"
                      style={{
                        padding: "0 10px",
                        fontSize: 14,
                        borderRadius: 4,
                      }}
                    >
                      VR
                    </Tag>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  {/* Title */}
                  <h3
                    className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2 line-clamp-2"
                    title={property.title}
                  >
                    <FileTextOutlined style={{ color: "#1890ff" }} />
                    {property.title}
                  </h3>

                  {/* Location */}
                  <p
                    className="text-sm text-gray-500 mb-4 flex items-center gap-2 line-clamp-1"
                    title={property.location}
                  >
                    <EnvironmentOutlined style={{ color: "#52c41a" }} />
                    {property.location}
                  </p>

                  {/* Price */}
                  <p className="mt-auto text-xl font-bold text-red-600 flex items-center gap-2">
                    <DollarCircleOutlined style={{ color: "#f5222d" }} />
                    {property.price.toLocaleString("vi-VN")} triệu
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-10">
          <Button
            type="default"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate("/real-estate")}
            style={{ fontWeight: "600" }}
          >
            Xem thêm bất động sản
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RealEstateSection;
