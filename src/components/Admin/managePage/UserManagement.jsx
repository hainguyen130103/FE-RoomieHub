import React, { useState, useEffect } from 'react';
import { getPaymentStatsApi, updateUserRoleApi, getUsersInfoApi } from '../../../services/Userservices';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const response = await getUsersInfoApi();
      console.log('Users API Response:', response.data);
      
      if (response.data && response.data.users) {
        // Set total users from API response
        setTotalUsers(response.data.totalUsers || response.data.users.length);
        
        // Transform API data to match component expectations
        const transformedUsers = response.data.users.map(user => ({
          id: user.userId,
          email: user.email,
          fullname: user.fullName || 'Chưa có tên',
          role: user.role
        }));
        
        setUsers(transformedUsers);
      } else {
        setUsers([]);
        setTotalUsers(0);
      }
      
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (newRole) => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await updateUserRoleApi(selectedUser.email, newRole);
      
      // Refresh data from server instead of just updating local state
      await fetchUsers();

      setSuccess(`Đã cập nhật role cho ${selectedUser.email} thành ${newRole}`);
      setShowRoleModal(false);
      setSelectedUser(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật role');
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const adminCount = users.filter(user => user.role === 'ADMIN').length;
  const userCount = users.filter(user => user.role === 'USER').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', background: 'transparent' }}>
      {/* Header Stats */}
      <div style={{
        background: 'linear-gradient(135deg, #fff5f0, #ffe4d6)',
        border: '2px solid #ffcc99',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 25px rgba(255, 140, 0, 0.2)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff8c00, #ff6600)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Quản lý người dùng
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <StatCard label="Tổng người dùng" value={totalUsers} color="#ff8c00" />
          <StatCard label="Admin" value={adminCount} color="#ff6600" />
          <StatCard label="User" value={userCount} color="#ff9933" />
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div style={{
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}
      
      {error && (
        <div style={{
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #fff5f0, #ffe4d6)',
        border: '2px solid #ffcc99',
        borderRadius: '15px',
        padding: '1rem',
        marginBottom: '2rem'
      }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo email, tên hoặc role..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '2px solid #ffcc99',
            borderRadius: '10px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#ff8c00';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ffcc99';
          }}
        />
      </div>

      {/* Users Table */}
      <div style={{
        background: 'linear-gradient(135deg, #fff5f0, #ffe4d6)',
        border: '2px solid #ffcc99',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(255, 140, 0, 0.2)',
        marginBottom: '2rem'
      }}>
        <div style={{
          overflow: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(90deg, #ff8c00, #ff6600)',
                color: 'white'
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Họ tên</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid #ffcc99',
                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 140, 0, 0.05)'
                  }}
                >
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#ff6600' }}>
                    {user.id}
                  </td>
                  <td style={{ padding: '1rem', color: '#333' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '1rem', color: '#333' }}>
                    {user.fullname}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: user.role === 'ADMIN' 
                        ? 'linear-gradient(90deg, #ff6600, #ff8c00)' 
                        : 'linear-gradient(90deg, #4CAF50, #66BB6A)',
                      color: 'white'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => openRoleModal(user)}
                      style={{
                        background: 'linear-gradient(90deg, #ff8c00, #ff6600)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      Đổi Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid #ffcc99',
                borderRadius: '8px',
                background: currentPage === number 
                  ? 'linear-gradient(90deg, #ff8c00, #ff6600)'
                  : 'white',
                color: currentPage === number ? 'white' : '#ff6600',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== number) {
                  e.target.style.background = 'rgba(255, 140, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== number) {
                  e.target.style.background = 'white';
                }
              }}
            >
              {number}
            </button>
          ))}
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            width: '400px',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(90deg, #ff8c00, #ff6600)',
              color: 'white',
              padding: '1rem',
              borderRadius: '15px 15px 0 0'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Thay đổi quyền người dùng
              </h3>
              <button
                onClick={closeRoleModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  color: 'white',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Họ tên:</strong> {selectedUser.fullname}</p>
                <p><strong>Role hiện tại:</strong> 
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: selectedUser.role === 'ADMIN' ? '#ff6600' : '#4CAF50',
                    color: 'white'
                  }}>
                    {selectedUser.role}
                  </span>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                  Chọn role mới:
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleRoleUpdate('USER')}
                    disabled={actionLoading || selectedUser.role === 'USER'}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #4CAF50',
                      borderRadius: '8px',
                      background: selectedUser.role === 'USER' ? '#ccc' : '#4CAF50',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: selectedUser.role === 'USER' || actionLoading ? 'not-allowed' : 'pointer',
                      opacity: selectedUser.role === 'USER' ? 0.5 : 1
                    }}
                  >
                    {actionLoading ? 'Đang xử lý...' : 'USER'}
                  </button>
                  <button
                    onClick={() => handleRoleUpdate('ADMIN')}
                    disabled={actionLoading || selectedUser.role === 'ADMIN'}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #ff6600',
                      borderRadius: '8px',
                      background: selectedUser.role === 'ADMIN' ? '#ccc' : '#ff6600',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: selectedUser.role === 'ADMIN' || actionLoading ? 'not-allowed' : 'pointer',
                      opacity: selectedUser.role === 'ADMIN' ? 0.5 : 1
                    }}
                  >
                    {actionLoading ? 'Đang xử lý...' : 'ADMIN'}
                  </button>
                </div>
              </div>

              <button
                onClick={closeRoleModal}
                disabled={actionLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#666',
                  fontWeight: 'bold',
                  cursor: actionLoading ? 'not-allowed' : 'pointer'
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255, 140, 0, 0.1)',
      padding: '1rem',
      borderRadius: '10px',
      border: '1px solid #ffcc99',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: color,
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: '#ff6600'
      }}>
        {label}
      </div>
    </div>
  );
}
