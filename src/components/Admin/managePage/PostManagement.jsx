import React, { useState, useEffect } from 'react';
import { getAllApartmentsApi, getApartmentsCountApi } from '../../../services/Userservices';

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
                    src={apartment.imageBase64List && apartment.imageBase64List[0] ? apartment.imageBase64List[0] : 'https://via.placeholder.com/350x200?text=No+Image'}
                    alt={apartment.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/350x200?text=No+Image';
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
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(90deg, #ff8c00, #ff6600)',
              color: 'white',
              padding: '1rem',
              borderRadius: '15px 15px 0 0',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Chi tiết bài đăng #{selectedApartment.id}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              {/* Images */}
              {selectedApartment.imageBase64List && selectedApartment.imageBase64List.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  {selectedApartment.imageBase64List.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${selectedApartment.title} - ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '2px solid #ffcc99'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/250x200?text=No+Image';
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <DetailItem label="Tiêu đề" value={selectedApartment.title} />
                <DetailItem label="Mô tả" value={selectedApartment.description} />
                <DetailItem label="Địa chỉ" value={selectedApartment.address} />
                <DetailItem label="Giá" value={formatCurrency(selectedApartment.price)} />
                <DetailItem label="Diện tích" value={formatArea(selectedApartment.area)} />
                <DetailItem label="Yêu cầu giới tính" value={selectedApartment.genderRequirement} />
                <DetailItem label="Tiền cọc" value={selectedApartment.deposit} />
                <DetailItem label="Giấy tờ pháp lý" value={selectedApartment.legalDocuments} />
                <DetailItem label="Tiện ích" value={selectedApartment.utilities} />
                <DetailItem label="Nội thất" value={selectedApartment.furniture} />
                <DetailItem label="Tình trạng nội thất" value={selectedApartment.interiorCondition} />
                <DetailItem label="Thang máy" value={selectedApartment.elevator} />
                <DetailItem label="Liên hệ" value={selectedApartment.contact} />
                <DetailItem label="Vị trí" value={selectedApartment.location} />
                <DetailItem label="User ID" value={selectedApartment.userId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Detail Item Component
function DetailItem({ label, value }) {
  return (
    <div style={{
      background: 'rgba(255, 140, 0, 0.1)',
      padding: '1rem',
      borderRadius: '10px',
      border: '1px solid #ffcc99'
    }}>
      <div style={{
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#ff6600',
        marginBottom: '0.5rem'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '1rem',
        color: '#333',
        wordBreak: 'break-word'
      }}>
        {value || 'Không có thông tin'}
      </div>
    </div>
  );
}