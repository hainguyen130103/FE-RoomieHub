import React from "react";
import logoImage from "../../assets/images/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-black pt-12 pb-6 mt-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">CÔNG TY TNHH ROOMIEHUB</h3>
            <p className="text-sm text-gray-400 mb-2">
              Số GCN ĐKDN 0318555010 do Sở KH&ĐT TP.HCM cấp ngày 08/07/2024
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Đại diện pháp luật: Hồ Hoàng Bảo
            </p>
            <p className="text-sm text-gray-400">Chức danh: Giám đốc</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Tải ứng dụng</h3>
            <div className="flex space-x-2">
              <a href="#" className="inline-block">
                <img
                  src="https://ext.same-assets.com/662425795/695940447.png"
                  alt="App Store"
                  className="h-10"
                />
              </a>
              <a href="#" className="inline-block">
                <img
                  src="https://ext.same-assets.com/662425795/338168882.png"
                  alt="Google Play"
                  className="h-10"
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Địa chỉ:</strong> 19-21 Tân Cảng, P.25, Q.Bình Thạnh,
              TP.HCM
            </p>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Email:</strong> info@roomiehub.com
            </p>
            <p className="text-sm text-gray-400">
              <strong>Điện thoại:</strong> 028 6287 3344
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Mục lục</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>
                <a href="#" className="hover:text-orange-500">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Công việc
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Bất động sản
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Hướng dẫn sử dụng app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={logoImage} alt="RoomiHub" className="h-6 mr-2" />
              <span className="text-sm text-gray-400">
                © 2025 RoomieHub. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-4 text-white">
              <a href="#" className="hover:text-orange-500">
                <i className="pi pi-facebook text-xl"></i>
              </a>
              <a href="#" className="hover:text-orange-500">
                <i className="pi pi-twitter text-xl"></i>
              </a>
              <a href="#" className="hover:text-orange-500">
                <i className="pi pi-instagram text-xl"></i>
              </a>
              <a href="#" className="hover:text-orange-500">
                <i className="pi pi-youtube text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
