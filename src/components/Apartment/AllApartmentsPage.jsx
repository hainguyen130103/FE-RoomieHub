import React, { useEffect, useState } from "react";
import { getAllApartmentsApi } from "../../services/Userservices";
import { useNavigate } from "react-router-dom";

const AllApartmentsPage = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await getAllApartmentsApi();
        setApartments(res.data || []);
      } catch (err) {
        setError("Không thể tải danh sách căn hộ.");
        console.error("Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Danh sách tất cả căn hộ
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/real-estate/${apt.id}`)}
            >
              <img
                src={apt.imageBase64List?.[0] || "/default-image.jpg"}
                alt={apt.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-semibold truncate">{apt.title}</h2>
                <p className="text-orange-500 font-bold">
                  {apt.price?.toLocaleString("vi-VN")} VNĐ
                </p>
                <p className="text-sm text-gray-600">{apt.area} m²</p>
                <p className="text-sm text-gray-500">
                  {apt.location || apt.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllApartmentsPage;
