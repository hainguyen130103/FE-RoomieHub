import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import {
  HomeIcon,
  BuildingOffice2Icon,
  RectangleGroupIcon,
  TicketIcon,
  BanknotesIcon,
  SunIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { getApartmentByIdApi } from "../services/Userservices";

// Component con để hiển thị từng mục thông tin trong phần tổng quan
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 text-gray-500 w-6 h-6">{icon}</div>
    <div className="text-sm">
      <span className="text-gray-600">{label}: </span>
      <strong className="text-gray-800 font-medium">{value}</strong>
    </div>
  </div>
);

export default function ApartmentDetail() {
  const { id } = useParams(); // Get the ID from the URL
  const [propertyData, setPropertyData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [viewMode, setViewMode] = useState("image"); // 'vr' or 'image'
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const response = await getApartmentByIdApi(id); // Fetch data by ID
        setPropertyData(response.data); // Assuming response.data is the apartment object
      } catch (err) {
        setError("Failed to load property details.");
        console.error("Error fetching property detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [id]); // Re-run effect if ID changes

  const nextImage = () => {
    if (propertyData && propertyData.images) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % propertyData.images.length
      );
    }
  };

  const prevImage = () => {
    if (propertyData && propertyData.images) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + propertyData.images.length) %
          propertyData.images.length
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        Loading property details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex items-center justify-center">
        No property found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex space-x-2">
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
          {/* Left Column: Image/VR Viewer */}
          <div className="lg:col-span-2">
            <div className="relative bg-black rounded-lg shadow-xl overflow-hidden aspect-w-16 aspect-h-9">
              {/* Image Slider */}
              {propertyData.images && propertyData.images.length > 0 ? (
                <img
                  src={propertyData.images[currentImageIndex]}
                  alt={propertyData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  No Image Available
                </div>
              )}

              {/* Slider Controls */}
              {propertyData.images && propertyData.images.length > 1 && (
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

              {/* View Mode Toggle */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 bg-opacity-70 p-1 rounded-full flex space-x-1">
                <button
                  onClick={() => setViewMode("vr")}
                  className={`px-4 py-1 text-sm font-medium rounded-full transition ${
                    viewMode === "vr" ? "bg-white text-black" : "text-white"
                  }`}
                >
                  VR
                </button>
                <button
                  onClick={() => setViewMode("image")}
                  className={`px-4 py-1 text-sm font-medium rounded-full transition ${
                    viewMode === "image" ? "bg-white text-black" : "text-white"
                  }`}
                >
                  Hình ảnh
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Information Panel */}
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
                <span className="text-2xl font-bold text-blue-600">
                  {propertyData.price}
                </span>
                <span className="text-gray-600"> - {propertyData.area}</span>
              </div>

              <div className="mt-6 border-t pt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-3 flex-shrink-0 text-gray-400" />
                  <span>{propertyData.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-3 flex-shrink-0 text-gray-400" />
                  <span>Đăng tin {propertyData.postedDate}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DocumentTextIcon className="h-5 w-5 mr-3 flex-shrink-0 text-gray-400" />
                  <span>Giấy tờ pháp lý: {propertyData.legalStatus}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Tổng quan về bất động sản
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
                {propertyData.overview &&
                  propertyData.overview.map((item, index) => (
                    <InfoItem
                      key={index}
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md flex space-x-4">
              <button className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                Liên hệ
              </button>
              <button className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center space-x-2">
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
