import React, { Component } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { getUserProfileApi, updateUserSurvey } from '../services/Userservices';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'profile',
      userInfo: null,
      loading: true,
      error: null,
      isEditing: false,
      showPreferences: false, // Riêng cho phần sở thích
      showApartmentInfo: false // Riêng cho phần căn hộ
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Token in Profile:', token);

      if (!token) {
        this.props.navigate('/'); // Chuyển về trang chủ
        return;
      }

      this.setState({ loading: true, error: null });

      // Fetch user data
      const response = await getUserProfileApi();
      
      if (response.data) {
        this.setState({ userInfo: response.data });
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.message.includes('Phiên đăng nhập đã hết hạn') || !localStorage.getItem('accessToken')) {
        this.props.navigate('/');
        return;
      }
      this.setState({ error: err.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleLogout = () => {
    localStorage.removeItem("accessToken");
    this.props.navigate('/');
  }

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  }

  setIsEditing = (editing) => {
    this.setState({ isEditing: editing });
  }

  setShowPreferences = (show) => {
    this.setState({ showPreferences: show });
  }

  setShowApartmentInfo = (show) => {
    this.setState({ showApartmentInfo: show });
  }

  updateUserInfo = (updates) => {
    this.setState(prevState => ({
      userInfo: { ...prevState.userInfo, ...updates }
    }));
  }

  navItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: 'pi pi-user' },
    { id: 'packages', label: 'Gói dịch vụ', icon: 'pi pi-box' },
    { id: 'posts', label: 'Bài đăng', icon: 'pi pi-file' },
    { id: 'roommates', label: 'Nhóm ở ghép', icon: 'pi pi-users' },
  ];

  renderError = () => {
    const { error } = this.state;
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
  }

  renderPreferencesSection = (userData, isEditing) => {
    const { showPreferences } = this.state;

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

    return (
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-heart text-orange-500 text-xl"></i>
            <h2 className="text-xl font-semibold">Thông tin sở thích</h2>
          </div>
          <Button
            icon={showPreferences ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            label={showPreferences ? "Thu gọn" : "Mở rộng"}
            className="p-button-text text-orange-500"
            onClick={() => this.setShowPreferences(!showPreferences)}
          />
        </div>

        {showPreferences && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Khoảng giá</label>
                <select 
                  value={userData.priceRange}
                  onChange={(e) => this.updateUserInfo({ priceRange: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ preferredLocation: e.target.value })}
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Hút thuốc</label>
                <select 
                  value={userData.smoking}
                  onChange={(e) => this.updateUserInfo({ smoking: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ pets: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ cookFrequency: e.target.value })}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Thói quen ngủ</label>
                <select 
                  value={userData.sleepHabit}
                  onChange={(e) => this.updateUserInfo({ sleepHabit: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ inviteFriends: e.target.value })}
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
          </div>
        )}
      </div>
    );
  }

  renderApartmentSection = (userData, isEditing) => {
    const { showApartmentInfo } = this.state;

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
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-home text-orange-500 text-xl"></i>
            <h2 className="text-xl font-semibold">Thông tin căn hộ</h2>
          </div>
          <Button
            icon={showApartmentInfo ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            label={showApartmentInfo ? "Thu gọn" : "Mở rộng"}
            className="p-button-text text-orange-500"
            onClick={() => this.setShowApartmentInfo(!showApartmentInfo)}
          />
        </div>

        {showApartmentInfo && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Giá (VNĐ)</label>
                <input 
                  type="number"
                  value={userData.price}
                  onChange={(e) => this.updateUserInfo({ price: parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Diện tích (m²)</label>
                <input 
                  type="number"
                  value={userData.area}
                  onChange={(e) => this.updateUserInfo({ area: parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">Đặt cọc (VNĐ)</label>
                <input 
                  type="number"
                  value={userData.deposit}
                  onChange={(e) => this.updateUserInfo({ deposit: parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">Tiện ích</label>
                <select 
                  value={userData.utilities}
                  onChange={(e) => this.updateUserInfo({ utilities: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ furniture: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ genderRequiment: e.target.value })}
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
                onChange={(e) => this.updateUserInfo({ location: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  renderProfileContent = () => {
    const { loading, error, userInfo, isEditing } = this.state;

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
      return this.renderError();
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

    return (
      <div className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <i className="pi pi-user text-orange-500 text-xl"></i>
              <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    label="Hủy bỏ" 
                    className="border-2 border-red-600 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200"
                    onClick={() => {
                      this.setIsEditing(false);
                      this.fetchData();
                    }}
                  />
                  <Button 
                    label="Lưu lại" 
                    className="border-2 border-green-600 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200"
                    onClick={async () => {
                      try {
                        this.setState({ loading: true });
                        const response = await updateUserSurvey(this.state.userInfo);
                        if (response.data) {
                          this.setState({ userInfo: response.data });
                        }
                        this.setIsEditing(false);
                      } catch (err) {
                        this.setState({ error: err.message });
                      } finally {
                        this.setState({ loading: false });
                      }
                    }}
                  />
                </>
              ) : (
                <Button 
                  label="Chỉnh sửa" 
                  icon="pi pi-pencil"
                  className="border-2 border-blue-600 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-5 py-2 rounded-xl shadow-md transition-all duration-200 gap-2"
                  onClick={() => this.setIsEditing(true)}
                />
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Họ tên</label>
              <input 
                type="text"
                value={userData.userName}
                onChange={(e) => this.updateUserInfo({ userName: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Nghề nghiệp</label>
              <select 
                value={userData.occupation}
                onChange={(e) => this.updateUserInfo({ occupation: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ gender: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ birthYear: parseInt(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Quê quán</label>
              <select 
                value={userData.hometown}
                onChange={(e) => this.updateUserInfo({ hometown: e.target.value })}
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
                  onChange={(e) => this.updateUserInfo({ currentLatitude: parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="number"
                  step="0.000001"
                  placeholder="Longitude"
                  value={userData.currentLongitude}
                  onChange={(e) => this.updateUserInfo({ currentLongitude: parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin sở thích - Section riêng biệt */}
        {this.renderPreferencesSection(userData, isEditing)}

        {/* Thông tin căn hộ - Section riêng biệt */}
        {this.renderApartmentSection(userData, isEditing)}
      </div>
    );
  }

  renderContent = () => {
    const { activeTab } = this.state;
    if (activeTab === 'profile') {
      return this.renderProfileContent();
    }
    return null;
  }

  render() {
    const { activeTab, userInfo } = this.state;

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
                    {this.navItems.map(item => (
                      <li key={item.id}>
                        <button
                          onClick={() => this.setActiveTab(item.id)}
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
                        onClick={this.handleLogout}
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
              {this.renderContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;