import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { getUserProfileApi, updateUserSurvey } from '../services/Userservices';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('Token in Profile:', token);

        if (!token) {
          navigate('/'); // Chuyển về trang chủ
          return;
        }

        setLoading(true);
        setError(null);

        // Fetch user data
        const response = await getUserProfileApi();
        
        if (response.data) {
          setUserInfo(response.data);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.message.includes('Phiên đăng nhập đã hết hạn') || !localStorage.getItem('accessToken')) {
          navigate('/');
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/');
  };

  const navItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: 'pi pi-user' },
    { id: 'packages', label: 'Gói dịch vụ', icon: 'pi pi-box' },
    { id: 'posts', label: 'Bài đăng', icon: 'pi pi-file' },
    { id: 'roommates', label: 'Nhóm ở ghép', icon: 'pi pi-users' },
  ];

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        <div className="flex items-center">
          <i className="pi pi-exclamation-circle mr-2" />
          <span className="font-medium">Lỗi:</span>
          <span className="ml-2">{error}</span>
        </div>
      </div>
    );
  };

  const renderProfileContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <i className="pi pi-spin pi-spinner mr-2" />
          <span>Đang tải...</span>
        </div>
      );
    }

    // Hiển thị lỗi nếu có
    if (error) {
      return renderError();
    }

    // Default empty values if userInfo is null
    const defaultUserInfo = {
      userName: '',
      birthYear: '',
      hometown: '',
      gender: '',
      occupation: '',
      currentLatitude: '',
      currentLongitude: '',
      priceRange: '',
      preferredLocation: '',
      smoking: '',
      pets: '',
      cookFrequency: '',
      sleepHabit: '',
      inviteFriends: '',
      price: '',
      area: '',
      genderRequiment: '',
      deposit: '',
      utilities: '',
      furniture: '',
      location: ''
    };

    // Merge default values with actual userInfo
    const userData = { ...defaultUserInfo, ...(userInfo || {}) };

    const genderOptions = [
      { label: 'Nam', value: 'MALE' },
      { label: 'Nữ', value: 'FEMALE' },
      { label: 'Khác', value: 'OTHER' }
    ];

    const hometownOptions = [
      { label: 'Hà Nội', value: 'HANOI' },
      { label: 'TP. Hồ Chí Minh', value: 'HCM' },
      { label: 'Đà Nẵng', value: 'DANANG' },
      { label: 'Huế', value: 'HUE' },
      { label: 'Khác', value: 'OTHER' }
    ];

    const occupationOptions = [
      { label: 'Sinh viên', value: 'STUDENT' },
      { label: 'Nhân viên văn phòng', value: 'OFFICE_WORKER' },
      { label: 'Freelancer', value: 'FREELANCER' },
      { label: 'Khác', value: 'OTHER' }
    ];

    const priceRangeOptions = [
      { label: 'Dưới 3 triệu', value: 'BELOW_3M' },
      { label: '3-5 triệu', value: 'FROM_3M_TO_5M' },
      { label: '5-7 triệu', value: 'FROM_5M_TO_7M' },
      { label: 'Trên 7 triệu', value: 'ABOVE_7M' }
    ];

    const preferredLocationOptions = [
      { label: 'Gần trường đại học', value: 'NEAR_UNIVERSITY' },
      { label: 'Gần khu vực kinh doanh', value: 'NEAR_BUSINESS_AREA' },
      { label: 'Khu vực yên tĩnh', value: 'QUIET_AREA' }
    ];

    const yesNoOptions = [
      { label: 'Có', value: 'YES' },
      { label: 'Không', value: 'NO' }
    ];

    const cookFrequencyOptions = [
      { label: 'Không bao giờ', value: 'NEVER' },
      { label: 'Thỉnh thoảng', value: 'SOMETIMES' },
      { label: 'Thường xuyên', value: 'OFTEN' }
    ];

    const sleepHabitOptions = [
      { label: 'Ngủ sớm', value: 'EARLY_SLEEPER' },
      { label: 'Cú đêm', value: 'NIGHT_OWL' },
      { label: 'Linh hoạt', value: 'FLEXIBLE' }
    ];

    const levelOptions = [
      { label: 'Cơ bản', value: 'BASIC' },
      { label: 'Tiêu chuẩn', value: 'STANDARD' },
      { label: 'Đầy đủ', value: 'FULL' }
    ];

    const genderRequirementOptions = [
      { label: 'Nam', value: 'MALE' },
      { label: 'Nữ', value: 'FEMALE' },
      { label: 'Không yêu cầu', value: 'ANY' }
    ];

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Họ tên</label>
              <input 
                type="text"
                value={userData.userName}
                onChange={(e) => setUserInfo({...userInfo, userName: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Nghề nghiệp</label>
              <select 
                value={userData.occupation}
                onChange={(e) => setUserInfo({...userInfo, occupation: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Chọn nghề nghiệp</option>
                {occupationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Giới tính</label>
                <select 
                  value={userData.gender}
                  onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Chọn giới tính</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Năm sinh</label>
                <input 
                  type="number"
                  value={userData.birthYear}
                  onChange={(e) => setUserInfo({...userInfo, birthYear: parseInt(e.target.value)})}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Quê quán</label>
              <select 
                value={userData.hometown}
                onChange={(e) => setUserInfo({...userInfo, hometown: e.target.value})}
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Chọn quê quán</option>
                {hometownOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Vị trí hiện tại</label>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number"
                  step="0.000001"
                  placeholder="Latitude"
                  value={userData.currentLatitude}
                  onChange={(e) => setUserInfo({...userInfo, currentLatitude: parseFloat(e.target.value)})}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="number"
                  step="0.000001"
                  placeholder="Longitude"
                  value={userData.currentLongitude}
                  onChange={(e) => setUserInfo({...userInfo, currentLongitude: parseFloat(e.target.value)})}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 mt-6">Thông tin sở thích</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Khoảng giá</label>
                  <select 
                    value={userData.priceRange}
                    onChange={(e) => setUserInfo({...userInfo, priceRange: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn khoảng giá</option>
                    {priceRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Vị trí ưa thích</label>
                  <select 
                    value={userData.preferredLocation}
                    onChange={(e) => setUserInfo({...userInfo, preferredLocation: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn vị trí</option>
                    {preferredLocationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Hút thuốc</label>
                  <select 
                    value={userData.smoking}
                    onChange={(e) => setUserInfo({...userInfo, smoking: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn</option>
                    {yesNoOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Thú cưng</label>
                  <select 
                    value={userData.pets}
                    onChange={(e) => setUserInfo({...userInfo, pets: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn</option>
                    {yesNoOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Tần suất nấu ăn</label>
                  <select 
                    value={userData.cookFrequency}
                    onChange={(e) => setUserInfo({...userInfo, cookFrequency: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn tần suất</option>
                    {cookFrequencyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Thói quen ngủ</label>
                  <select 
                    value={userData.sleepHabit}
                    onChange={(e) => setUserInfo({...userInfo, sleepHabit: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn thói quen</option>
                    {sleepHabitOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Mời bạn bè</label>
                  <select 
                    value={userData.inviteFriends}
                    onChange={(e) => setUserInfo({...userInfo, inviteFriends: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn</option>
                    {yesNoOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4 mt-6">Thông tin căn hộ</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Giá (VNĐ)</label>
                  <input 
                    type="number"
                    value={userData.price}
                    onChange={(e) => setUserInfo({...userInfo, price: parseFloat(e.target.value)})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Diện tích (m²)</label>
                  <input 
                    type="number"
                    value={userData.area}
                    onChange={(e) => setUserInfo({...userInfo, area: parseFloat(e.target.value)})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Đặt cọc (VNĐ)</label>
                  <input 
                    type="number"
                    value={userData.deposit}
                    onChange={(e) => setUserInfo({...userInfo, deposit: parseFloat(e.target.value)})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Tiện ích</label>
                  <select 
                    value={userData.utilities}
                    onChange={(e) => setUserInfo({...userInfo, utilities: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn tiện ích</option>
                    {levelOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Nội thất</label>
                  <select 
                    value={userData.furniture}
                    onChange={(e) => setUserInfo({...userInfo, furniture: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn nội thất</option>
                    {levelOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Yêu cầu giới tính</label>
                  <select 
                    value={userData.genderRequiment}
                    onChange={(e) => setUserInfo({...userInfo, genderRequiment: e.target.value})}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Chọn giới tính</option>
                    {genderRequirementOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-2">Địa chỉ</label>
                <input 
                  type="text"
                  value={userData.location}
                  onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                {isEditing ? (
                  <>
                    <Button 
                      label="Hủy bỏ" 
                      className="p-button-text" 
                      onClick={() => {
                        setIsEditing(false);
                        setUserInfo({...userInfo}); // Reset to original data
                      }}
                    />
                    <Button 
                      label="Lưu lại" 
                      className="p-button-primary"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const response = await updateUserSurvey(userInfo);
                          if (response.data) {
                            setUserInfo(response.data);
                          }
                          setIsEditing(false);
                        } catch (err) {
                          setError(err.message);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                  </>
                ) : (
                  <Button 
                    label="Chỉnh sửa" 
                    className="p-button-primary"
                    onClick={() => setIsEditing(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return renderProfileContent();
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <div className="container mx-auto py-6 px-4">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64">
            {/* User Info */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow">
              <div className="flex items-center gap-3">
                <Avatar 
                  size="large"
                  shape="circle"
                  icon="pi pi-user"
                  className="bg-orange-500"
                />
                <div>
                  <h3 className="font-semibold">{userInfo?.userName || 'Loading...'}</h3>
                  <p className="text-sm text-gray-500">{userInfo?.hometown}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow">
              <nav className="p-2">
                <ul className="space-y-1">
                  {navItems.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors
                          ${activeTab === item.id 
                            ? 'bg-orange-50 text-orange-500 font-medium' 
                            : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm text-red-600 hover:bg-red-50"
                    >
                      <i className="pi pi-sign-out"></i>
                      <span>Đăng xuất</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;