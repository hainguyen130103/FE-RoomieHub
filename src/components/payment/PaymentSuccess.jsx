import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Get payment details from URL
    const code = searchParams.get('code');
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode');
    
    console.log('Payment Success:', { code, id, status, orderCode });
    
    // Show success message for 3 seconds then redirect to package page
    const timer = setTimeout(() => {
      navigate('/package', { replace: true });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã mua gói dịch vụ RoomieHub. Gói của bạn đã được kích hoạt.
          </p>
          <p className="text-sm text-gray-500">
            Đang chuyển hướng về trang gói dịch vụ...
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
        
        <button 
          onClick={() => navigate('/package')}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Quay lại ngay
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
