import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { getAllApartmentsApi } from "../../services/Userservices";
import { useNavigate } from "react-router-dom";

const RealEstateSection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await getAllApartmentsApi();
        // Assuming your API returns an array of apartments directly
        setProperties(response.data);
      } catch (err) {
        setError("Failed to fetch apartments.");
        console.error("Error fetching apartments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const categories = [
    { name: "Bất động sản thương mại cho thuê", icon: "pi pi-building" },
    { name: "Bất động sản thương mại cho bán", icon: "pi pi-dollar" },
    { name: "Chung cư", icon: "pi pi-home" },
    { name: "Đất", icon: "pi pi-map" },
    { name: "Tòa nhà văn phòng", icon: "pi pi-briefcase" },
    { name: "Phòng trọ", icon: "pi pi-key" },
    { name: "Nhà xưởng", icon: "pi pi-cog" },
    { name: "Cửa hàng", icon: "pi pi-shopping-cart" },
  ];

  const handleCardClick = (propertyId) => {
    navigate(`/real-estate/${propertyId}`);
  };

  if (loading) {
    return (
      <section className="py-12 bg-white text-center">
        <div className="container mx-auto px-4">Loading properties...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white text-center">
        <div className="container mx-auto px-4 text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Xem bất động sản bằng VR
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="p-0 h-full hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(property.id)}
            >
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {property.hasVR && (
                  <div className="absolute top-2 left-2">
                    <Tag value="VR" severity="info" icon="pi pi-eye" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">
                  {property.title}
                </h3>
                <div className="flex items-center mb-2 text-sm text-gray-600">
                  <span className="bg-gray-100 rounded px-2 py-1 mr-2">
                    {property.type}
                  </span>
                  {property.bedrooms > 0 && (
                    <span className="bg-gray-100 rounded px-2 py-1 mr-2">
                      {property.bedrooms} PN
                    </span>
                  )}
                  <span className="bg-gray-100 rounded px-2 py-1">
                    {property.area}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-bold text-orange-500">
                    {property.price}
                  </span>
                  <span className="text-gray-500">{property.timeAgo}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="pi pi-map-marker mr-1 text-gray-400"></i>
                  <span>{property.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Tìm nhà theo danh mục
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center">
                  <i
                    className={`${category.icon} text-orange-500 text-xl mr-3`}
                  ></i>
                  <span className="text-sm md:text-base font-medium">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            label="Xem thêm về bất động sản"
            className="p-button-outlined"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
      </div>
    </section>
  );
};

export default RealEstateSection;
