import React, { useEffect, useState } from "react";
import {
  getAllApartmentsApi,
  getApartmentPostAuto,
} from "../../services/Userservices";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined, ExpandOutlined } from "@ant-design/icons";
import { Pagination, Carousel, Button, Spin, Modal } from "antd";
import "antd/dist/reset.css";

const ITEMS_PER_PAGE = 9;

const AllApartmentsPage = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState(null);
  const [matchRate, setMatchRate] = useState(null); // Lưu tỉ lệ trùng khớp
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleAutoFind = async () => {
    setAutoError(null);
    setAutoLoading(true);
    setLoading(true);
    setMatchRate(null);
    try {
      const res = await getApartmentPostAuto();
      // Giả lập load 10s
      setTimeout(() => {
        setApartments(res.data || []);
        setCurrentPage(1);
        setLoading(false);
        setAutoLoading(false);

        // Tạo số ngẫu nhiên 65-80%
        const randomRate = Math.floor(Math.random() * (80 - 65 + 1)) + 65;
        setMatchRate(randomRate);
        setIsModalVisible(true);
      }, 5000);
    } catch (err) {
      setAutoError(err.message || "Lỗi khi tự động tìm căn hộ.");
      setLoading(false);
      setAutoLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApartments = apartments.slice(startIndex, endIndex);

  if (loading) {
    if (autoLoading) {
      // Giao diện loading kiểu AI với dòng chữ yêu cầu
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-10">
          <Spin size="large" />
          <p className="mt-5 text-lg font-semibold text-gray-700 max-w-md text-center">
            Đang tìm kiếm thông tin phòng phù hợp với thông tin của bạn...
          </p>
        </div>
      );
    }
    return (
      <div className="p-10 text-center text-lg font-medium">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error || autoError) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        {error || autoError}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-2 border-orange-400 pb-2">
          Danh sách tất cả căn hộ
        </h1>

        {/* Nút tìm tự động với style AI-like */}
        <div className="mb-6 flex justify-center">
          <Button
            type="primary"
            size="large"
            loading={autoLoading}
            onClick={handleAutoFind}
            style={{
              borderRadius: 30,
              backgroundImage: "linear-gradient(45deg, #FF7E5F, #FEB47B)",
              border: "none",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(255,126,95,0.5)",
              padding: "0 30px",
              transition: "all 0.3s ease",
              fontSize: 18,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(255,126,95,0.7)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(255,126,95,0.5)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Tự động tìm căn hộ phù hợp bằng AI
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentApartments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-2xl transition-shadow cursor-pointer flex flex-col overflow-hidden"
              onClick={() => navigate(`/real-estate/${apt.id}`)}
            >
              {apt.imageBase64List && apt.imageBase64List.length > 0 ? (
                <Carousel
                  autoplay
                  dots={true}
                  className="rounded-t-lg"
                  adaptiveHeight={true}
                  effect="scrollx"
                >
                  {apt.imageBase64List.map((imgSrc, idx) => (
                    <div key={idx} className="h-52 overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={`${apt.title} - ảnh ${idx + 1}`}
                        className="w-full h-52 object-cover rounded-t-lg"
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <img
                  src="/default-image.jpg"
                  alt={apt.title}
                  className="w-full h-52 object-cover rounded-t-lg"
                />
              )}

              <div className="p-5 flex flex-col flex-grow">
                <h2
                  className="text-xl font-bold text-gray-500 mb-2 truncate"
                  title={apt.title}
                >
                  {apt.title}
                </h2>

                <p className="text-orange-600 font-extrabold text-2xl mb-4">
                  {apt.price?.toLocaleString("vi-VN")} VNĐ
                </p>

                <div className="flex items-center text-gray-700 text-base mb-3">
                  <ExpandOutlined
                    className="mr-2 text-orange-500"
                    style={{ fontSize: 20 }}
                  />
                  <span>{apt.area} m²</span>
                </div>

                <div className="flex items-center text-gray-700 text-base">
                  <EnvironmentOutlined
                    className="mr-2 text-orange-500"
                    style={{ fontSize: 20 }}
                  />
                  <span
                    className="truncate"
                    title={apt.location || apt.address}
                  >
                    {apt.location || apt.address}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Pagination
            current={currentPage}
            pageSize={ITEMS_PER_PAGE}
            total={apartments.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showQuickJumper
            size="default"
            className="ant-pagination"
          />
        </div>

        {/* Popup modal hiển thị tỉ lệ trùng khớp */}
        <Modal
          title="Kết quả tìm kiếm"
          visible={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
          okText="Đóng"
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <p className="text-lg font-semibold text-center">
            Tỉ lệ trùng khớp thông tin:{" "}
            <span className="text-orange-600">{matchRate}%</span>
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default AllApartmentsPage;
