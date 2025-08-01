import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, getUserProfileApi } from '../services/Userservices';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user name
        const userResponse = await getUserInfo();
        setUserName(userResponse.data);

        // Fetch user profile data
        const profileResponse = await getUserProfileApi();
        if (profileResponse.data) {
          setUserInfo(profileResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/');
        }
        setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
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

  const renderProfileContent = () => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    // Default empty values if userInfo is null
    const defaultUserInfo = {
      userName: '',
      birthYear: '',
      hometown: '',
      gender: '',
      occupation: '',
      currentLatitude: '',
      currentLongitude: ''
    };

    // Merge default values with actual userInfo
    const userData = { ...defaultUserInfo, ...(userInfo || {}) };

    const genderOptions = [
      { label: 'Nam', value: 'MALE' },
      { label: 'Nữ', value: 'FEMALE' }
    ];

    const occupationOptions = [
      { label: 'Sinh viên', value: 'STUDENT' },
      { label: 'Đi làm', value: 'WORKING' }
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Nghề nghiệp</label>
              <select 
                value={userData.occupation}
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
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Quê quán</label>
              <input 
                type="text"
                value={userData.hometown}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Vị trí hiện tại</label>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text"
                  placeholder="Latitude"
                  value={userData.currentLatitude}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="text"
                  placeholder="Longitude"
                  value={userData.currentLongitude}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button label="Hủy bỏ" className="p-button-text" />
              <Button label="Lưu lại" className="p-button-primary" />
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
                  <h3 className="font-semibold">{userName || 'Loading...'}</h3>
                  <p className="text-sm text-gray-500">{userInfo?.email}</p>
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