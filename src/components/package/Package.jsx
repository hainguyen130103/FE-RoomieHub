import React, { useState } from "react";
import SidebarNav from "../layouts/SidebarNav";
import { createPaymentApi } from "../../services/Userservices";

const packageDetails = {
  BASIC: {
    title: "BASIC",
    price: 10000,
    description: "Đăng tối đa 10 bài. Không hỗ trợ đăng video. Phù hợp cho người dùng mới hoặc đăng thử nghiệm.",
    icon: "🏠",
    color: "from-blue-400 to-blue-600",
    buttonColor: "bg-blue-500 hover:bg-blue-600"
  },
  PROFESSIONAL: {
    title: "PROFESSIONAL", 
    price: 100000,
    description: "Đăng tối đa 30 bài. Hỗ trợ đăng ảnh và video. Thích hợp cho người tìm kiếm bạn cùng phòng hoặc cho thuê nhiều hơn.",
    icon: "🏢",
    color: "from-green-400 to-green-600",
    buttonColor: "bg-green-500 hover:bg-green-600"
  },
  VIP: {
    title: "VIP",
    price: 150000,
    description: "Đăng tối đa 100 bài. Ưu tiên hiển thị bài đăng, hỗ trợ ảnh & video. Lựa chọn tối ưu cho môi giới hoặc người cho thuê chuyên nghiệp.",
    icon: "👑",
    color: "from-yellow-400 to-yellow-600",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600"
  },
  VR: {
    title: "VR",
    price: 200000,
    description: "Đăng tối đa 3 bài với hỗ trợ VR 360°. Giúp người xem trải nghiệm thực tế không gian phòng trước khi liên hệ.",
    icon: "🥽",
    color: "from-purple-400 to-purple-600",
    buttonColor: "bg-purple-500 hover:bg-purple-600"
  }
};

const Package = () => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleBuyPackage = async (packageType) => {
    setLoading(prev => ({ ...prev, [packageType]: true }));
    setError(null);
    setSuccess(null);

    try {
      const paymentData = {
        packageType: packageType,
        description: `Mua gói ${packageDetails[packageType].title}`,
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      };

      const response = await createPaymentApi(paymentData);
      
      if (response.data && response.data.data && response.data.data.checkoutUrl) {
        setSuccess(`Đang chuyển hướng đến trang thanh toán cho gói ${packageType}...`);
        setCountdown(3);
        
        // Countdown timer
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              window.location.href = response.data.data.checkoutUrl;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        throw new Error('Không nhận được URL thanh toán');
      }
    } catch (err) {
      console.error('Payment creation error:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo thanh toán');
      setCountdown(0);
    } finally {
      setLoading(prev => ({ ...prev, [packageType]: false }));
    }
  };

  return (
    <SidebarNav>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 text-center rounded-lg">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Gói Dịch Vụ RoomieHub
            </h2>
            <p className="text-gray-600 mb-10">
              Lựa chọn gói phù hợp với nhu cầu đăng bài của bạn
            </p>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg max-w-md mx-auto">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-2"></div>
                  <span>{success}</span>
                </div>
                {countdown > 0 && (
                  <div className="mt-2 text-sm">
                    Chuyển hướng sau <span className="font-bold text-green-800">{countdown}</span> giây
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              {Object.entries(packageDetails).map(([packageType, pkg]) => (
                <div
                  key={packageType}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${pkg.color} rounded-lg p-4 mb-4 text-white`}>
                    <div className="text-4xl mb-2">{pkg.icon}</div>
                    <h3 className="text-xl font-bold">{pkg.title}</h3>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(pkg.price)}
                    </p>
                    <p className="text-gray-500 text-sm">một lần</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuyPackage(packageType)}
                    disabled={loading[packageType]}
                    className={`w-full ${pkg.buttonColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading[packageType] ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      'Mua ngay'
                    )}
                  </button>

                  {/* Features based on package type */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <ul className="text-sm text-left text-gray-700 space-y-2">
                      {packageType === 'BASIC' && (
                        <>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Tối đa 10 bài đăng
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Hỗ trợ cơ bản
                          </li>
                          <li className="flex items-center">
                            <span className="text-red-500 mr-2">✗</span>
                            Không hỗ trợ video
                          </li>
                        </>
                      )}
                      {packageType === 'PROFESSIONAL' && (
                        <>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Tối đa 30 bài đăng
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Hỗ trợ ảnh và video
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Ưu tiên hỗ trợ
                          </li>
                        </>
                      )}
                      {packageType === 'VIP' && (
                        <>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Tối đa 100 bài đăng
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Ưu tiên hiển thị
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Hỗ trợ ảnh & video
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Hỗ trợ 24/7
                          </li>
                        </>
                      )}
                      {packageType === 'VR' && (
                        <>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Tối đa 3 bài VR 360°
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Trải nghiệm thực tế ảo
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Công nghệ tiên tiến
                          </li>
                          <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            Hỗ trợ chuyên biệt
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-10 p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                💡 Lưu ý quan trọng
              </h3>
              <p className="text-gray-700 text-sm">
                Tất cả các gói đều hỗ trợ đăng bài tìm bạn cùng phòng và cho thuê phòng. 
                Thanh toán một lần, sử dụng ngay lập tức. Hỗ trợ khách hàng 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarNav>
  );
};

export default Package;
