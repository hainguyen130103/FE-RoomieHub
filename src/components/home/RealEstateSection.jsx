import React, { useState, useEffect } from "react";
import { getAllApartmentsApi } from "../../services/Userservices";
import { useNavigate } from "react-router-dom";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// ✅ Component chính
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
        <h2 className="text-2xl font-bold mb-6">Phòng/Nhà đang cho thuê</h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop
        >
          {properties.map((property) => (
            <SwiperSlide key={property.id}>
              <div
                onClick={() => handleCardClick(property.id)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={property.imageBase64List?.[0] || "/default-image.jpg"}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {property.hasVR && (
                    <Tag
                      value="VR"
                      severity="info"
                      icon="pi pi-eye"
                      className="absolute top-2 left-2"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate mb-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {property.location}
                  </p>
                  <p className="text-orange-500 font-semibold">
                    {property.price} triệu
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-8">
          <Button
            label="Xem thêm bất động sản"
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-outlined"
            onClick={() => navigate("/real-estate")}
          />
        </div>
      </div>
    </section>
  );
};

export default RealEstateSection;
