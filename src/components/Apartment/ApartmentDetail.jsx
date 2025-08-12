import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { getApartmentByIdApi } from "../../services/Userservices";

export default function ApartmentDetail() {
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [viewMode, setViewMode] = useState("image");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const response = await getApartmentByIdApi(id);
        setPropertyData(response.data);
      } catch (err) {
        setError("Không thể tải chi tiết căn hộ.");
        console.error("Lỗi khi fetch chi tiết căn hộ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [id]);

  const nextImage = () => {
    const images = propertyData?.imageBase64List || [];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = propertyData?.imageBase64List || [];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!propertyData)
    return <div className="p-10 text-center">Không tìm thấy căn hộ.</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="inline-flex space-x-2">
            <li>
              <a href="/" className="hover:underline">
                Trang chủ
              </a>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <a href="/real-estate" className="hover:underline">
                Bất động sản
              </a>
            </li>
            <li>
              <span>/</span>
            </li>
            <li className="text-gray-700 truncate">{propertyData.title}</li>
          </ol>
        </nav>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Ảnh lớn */}
            <div className="relative bg-black rounded-lg shadow-xl overflow-hidden aspect-w-16 aspect-h-9">
              {propertyData.imageBase64List &&
              propertyData.imageBase64List.length > 0 ? (
                <img
                  src={propertyData.imageBase64List[currentImageIndex]}
                  alt={propertyData.title}
                  className="w-full h-[800px] object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  No Image Available
                </div>
              )}

              {propertyData.imageBase64List?.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <button
                    onClick={prevImage}
                    className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </div>
              )}

              {/* Nút chuyển VR/Hình ảnh */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 bg-opacity-70 p-1 rounded-full flex space-x-1">
                <button
                  onClick={() => setViewMode("vr")}
                  className={`px-4 py-1 text-sm font-medium rounded-full transition ${viewMode === "vr" ? "bg-white text-black" : "text-white"}`}
                >
                  VR
                </button>
                <button
                  onClick={() => setViewMode("image")}
                  className={`px-4 py-1 text-sm font-medium rounded-full transition ${viewMode === "image" ? "bg-white text-black" : "text-white"}`}
                >
                  Hình ảnh
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {propertyData.imageBase64List?.length > 1 && (
              <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                {propertyData.imageBase64List.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-24 h-20 object-cover rounded cursor-pointer border-2 transition ${
                      idx === currentImageIndex
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {propertyData.title}
                </h1>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="p-2 -mr-2 text-gray-400 hover:text-red-500"
                >
                  {isFavorited ? (
                    <HeartIcon className="w-7 h-7 text-red-500" />
                  ) : (
                    <HeartIconOutline className="w-7 h-7" />
                  )}
                </button>
              </div>

              <div className="mt-2">
                <span className="text-2xl font-bold text-red-600">
                  {propertyData.price?.toLocaleString("vi-VN")} VNĐ
                </span>
                <span className="text-gray-600"> - {propertyData.area} m²</span>
              </div>

              <div className="mt-6 border-t pt-6 space-y-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{propertyData.address || propertyData.location}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Đăng tin gần đây</span>
                </div>
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>
                    Pháp lý: {propertyData.legalDocuments || "Không rõ"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin chi tiết
              </h2>
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-semibold">Nội thất:</span>{" "}
                  {propertyData.furniture || "Không có"}
                </p>
                <p>
                  <span className="font-semibold">Tiện ích:</span>{" "}
                  {propertyData.utilities || "Không có"}
                </p>
                <p>
                  <span className="font-semibold">Tình trạng nội thất:</span>{" "}
                  {propertyData.interiorCondition || "Không rõ"}
                </p>
                <p>
                  <span className="font-semibold">Thang máy:</span>{" "}
                  {propertyData.elevator || "Không có"}
                </p>
                <p>
                  <span className="font-semibold">Tiền cọc:</span>{" "}
                  {propertyData.deposit || "Thỏa thuận"}
                </p>
                <p>
                  <span className="font-semibold">Yêu cầu giới tính:</span>{" "}
                  {propertyData.genderRequirement === "MALE"
                    ? "Nam"
                    : propertyData.genderRequirement === "FEMALE"
                      ? "Nữ"
                      : "Không yêu cầu"}
                </p>
                <p>
                  <span className="font-semibold">Liên hệ:</span>{" "}
                  {propertyData.contact || "Không rõ"}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Mô tả
              </h2>
              <p className="text-sm text-gray-700">
                {propertyData.description || "Không có mô tả."}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4">
              <button className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                Liên hệ
              </button>
              <button className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 flex items-center justify-center space-x-2">
                <ShareIcon className="w-5 h-5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
