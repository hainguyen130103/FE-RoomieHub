import React, { useState, useEffect } from 'react';
import { getAllApartmentsApi, getApartmentsCountApi } from '../../../services/Userservices';
import { formatImageUrl, getFallbackImage } from '../../../utils/imageUtils';

export default function PostManagement() {
  const [apartments, setApartments] = useState([]);
  const [apartmentCount, setApartmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apartmentsResponse, countResponse] = await Promise.all([
        getAllApartmentsApi(),
        getApartmentsCountApi()
      ]);
      
      setApartments(apartmentsResponse.data || []);
      setApartmentCount(countResponse.data || 0);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu bài đăng');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatArea = (area) => {
    return `${area} m²`;
  };

  const handleViewDetail = (apartment) => {
    setSelectedApartment(apartment);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedApartment(null);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApartments = apartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(apartments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
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
          Quản lý bài đăng
        </h1>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255, 140, 0, 0.1)',
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid #ffcc99'
        }}>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#ff6600',
            marginRight: '1rem'
          }}>
            Tổng số bài đăng:
          </span>
          <span style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#ff8c00'
          }}>
            {apartmentCount}
          </span>
        </div>
      </div>

      {/* Fixed Grid Layout - Always 4x2 = 8 positions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, auto)',
        gap: '1.5rem',
        marginBottom: '2rem',
        maxWidth: '100%'
      }}>
        {Array.from({ length: 8 }, (_, index) => {
          const apartment = currentApartments[index];
          
          if (apartment) {
            // Render apartment card
            return (
              <div
                key={apartment.id}
                style={{
                  background: 'linear-gradient(135deg, #fff5f0, #ffe4d6)',
                  border: '2px solid #ffcc99',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 25px rgba(255, 140, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 140, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 140, 0, 0.2)';
                }}
              >
                {/* Image */}
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={apartment.imageBase64s && apartment.imageBase64s[0] ? (formatImageUrl(apartment.imageBase64s[0]) || getFallbackImage(350, 200)) : getFallbackImage(350, 200)}
                    alt={apartment.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.error('Admin card image failed to load:', apartment.imageBase64s?.[0]);
                      e.target.src = getFallbackImage(350, 200);
                    }}
                    onLoad={(e) => {
                      console.log('Admin card image loaded successfully');
                    }}
                  />
                  
                </div>

                {/* Content */}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#ff6600',
                    marginBottom: '0.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {apartment.title}
                  </h3>
                  
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    📍 {apartment.address}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: '#ff8c00'
                    }}>
                      {formatCurrency(apartment.price)}
                    </span>
                    <span style={{
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      {formatArea(apartment.area)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewDetail(apartment)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(90deg, #ff8c00, #ff6600)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      fontSize: '1rem',
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
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          } else {
            // Render empty placeholder
            return (
              <div
                key={`empty-${index}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: '2px dashed #ffcc99',
                  borderRadius: '15px',
                  height: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.4
                }}
              >
                <div style={{
                  textAlign: 'center',
                  color: '#ffcc99',
                  fontSize: '1rem'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
                  <div>Vị trí trống</div>
                </div>
              </div>
            );
          }
        })}
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

      {/* Detail Modal */}
      {showDetailModal && selectedApartment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: "85vw",
            maxWidth: "1200px",
            maxHeight: "90vh",
            background: "linear-gradient(135deg, #fff5f0, #ffe4d6)",
            borderRadius: "20px",
            border: "3px solid #ff8c00",
            boxShadow: "0 10px 40px rgba(255,140,0,0.4)",
            overflow: "hidden",
            position: "relative"
          }}>
            {/* Header tùy chỉnh với nút đóng */}
            <div style={{ 
              background: "linear-gradient(45deg, #ff8c00, #ff6600)", 
              color: "white", 
              padding: "25px 70px 25px 25px",
              margin: "0",
              borderRadius: "20px 20px 0 0",
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "bold",
              position: "relative",
              boxShadow: "0 2px 10px rgba(255,140,0,0.3)"
            }}>
              Chi tiết bài đăng
              
              {/* Nút đóng tùy chỉnh */}
              <button
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(255, 0, 0, 0.8)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  transition: "all 0.3s ease",
                  zIndex: 1000
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 0, 0, 1)";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 0, 0, 0.8)";
                  e.target.style.transform = "scale(1)";
                }}
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
            
            <div style={{
              padding: "30px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "15px",
              margin: "20px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              maxHeight: "75vh",
              overflowY: "auto",
              border: "1px solid #ffcc99"
            }}>
              <div style={{ borderBottom: "3px solid #ff8c00", paddingBottom: "20px", marginBottom: "25px" }}>
                <h3 style={{ color: "#ff8c00", margin: "0", fontSize: "20px", textAlign: "center" }}>Thông tin cơ bản</h3>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Tiêu đề:</strong></p>
                  <p style={{ color: "#ff6600", fontWeight: "bold", margin: "5px 0" }}>{selectedApartment.title}</p>
                </div>
                
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Giá thuê:</strong></p>
                  <p style={{ color: "#ff6600", fontWeight: "bold", fontSize: "16px", margin: "5px 0" }}>{formatCurrency(selectedApartment.price)}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Diện tích:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{formatArea(selectedApartment.area)}</p>
                </div>
                
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Đặt cọc:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.deposit || 'Không yêu cầu'}</p>
                </div>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Địa chỉ:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.address}</p>
                </div>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Mô tả:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0", lineHeight: "1.5" }}>{selectedApartment.description}</p>
                </div>
              </div>

              {/* Hiển thị hình ảnh trong phần thông tin cơ bản */}
              {selectedApartment.imageBase64s && selectedApartment.imageBase64s.length > 0 && (
                <div style={{ marginBottom: "25px" }}>
                  <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                    <p style={{ margin: "5px 0 15px 0" }}><strong style={{ color: "#333" }}>Hình ảnh:</strong></p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {selectedApartment.imageBase64s.map((imageUrl, index) => (
                        <div key={index} style={{ 
                          borderRadius: "8px", 
                          overflow: "hidden", 
                          boxShadow: "0 2px 8px rgba(255,140,0,0.3)",
                          border: "2px solid #ffcc99",
                          flexShrink: 0
                        }}>
                          <img 
                            src={formatImageUrl(imageUrl) || getFallbackImage(100, 100, "No+Image")} 
                            alt={`Hình ảnh ${index + 1}`}
                            style={{ 
                              width: "100px", 
                              height: "100px", 
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                              cursor: "pointer"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "scale(1)";
                            }}
                            onError={(e) => {
                              console.error('Admin modal image failed to load:', imageUrl);
                              e.target.src = getFallbackImage(100, 100, "No+Image");
                              e.target.alt = "Không thể tải hình ảnh";
                            }}
                            onLoad={(e) => {
                              console.log('Admin modal image loaded successfully');
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Thông tin bổ sung */}
              <div style={{ borderBottom: "3px solid #ff8c00", paddingBottom: "20px", marginBottom: "25px" }}>
                <h3 style={{ color: "#ff8c00", margin: "0", fontSize: "20px", textAlign: "center" }}>Thông tin bổ sung</h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Yêu cầu giới tính:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.genderRequirement || 'Không yêu cầu'}</p>
                </div>
                
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Thang máy:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.elevator || 'Không có'}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Tiện ích:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.utilities || 'Không có'}</p>
                </div>
                
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Nội thất:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.furniture || 'Không có'}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Giấy tờ pháp lý:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.legalDocuments || 'Không có'}</p>
                </div>
                
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Tình trạng nội thất:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.interiorCondition || 'Không có'}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Thông tin liên hệ:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.contact || 'Không có'}</p>
                </div>
                
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Vị trí:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.location || 'Không có'}</p>
                </div>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>User ID:</strong></p>
                  <p style={{ color: "#333", margin: "5px 0" }}>{selectedApartment.userId || 'Không có'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}