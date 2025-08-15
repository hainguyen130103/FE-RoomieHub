import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import SidebarNav from "../components/layouts/SidebarNav";
import { getMyApartmentsApi, getMyApartmentsCountApi, deleteApartmentApi } from "../services/Userservices";
import { formatImageUrl, getFallbackImage } from "../utils/imageUtils";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows] = useState(4);
  const toast = useRef(null);

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [postsResponse, countResponse] = await Promise.all([
        getMyApartmentsApi(),
        getMyApartmentsCountApi()
      ]);
      
      setPosts(postsResponse.data || []);
      setCount(countResponse.data || 0);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (post) => {
    setSelectedPost(post);
    setShowDetailDialog(true);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      setDeleteLoading(true);
      await deleteApartmentApi(postToDelete.id);
      
      // Refresh danh sách bài đăng sau khi xóa thành công
      await fetchPosts();
      
      // Đóng dialog và reset state
      setShowDeleteConfirm(false);
      setPostToDelete(null);
      
      // Thông báo thành công bằng toast
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Xóa bài đăng thành công!',
        life: 3000
      });
    } catch (err) {
      console.error('Error deleting post:', err);
      // Thông báo lỗi bằng toast
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Có lỗi xảy ra khi xóa bài đăng: ' + err.message,
        life: 5000
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatArea = (area) => {
    return `${area} m²`;
  };

  const cardStyle = {
    backgroundColor: "white",
    border: "2px solid #ff8c00",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(255,140,0,0.3)",
    margin: "1rem",
    padding: "1.5rem",
    color: "black",
    transition: "transform 0.3s ease"
  };

  const buttonStyle = {
    background: "linear-gradient(45deg, #ff8c00, #ff6600)",
    border: "none",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    textTransform: "uppercase",
    boxShadow: "0 4px 15px rgba(255,140,0,0.4)",
    transition: "all 0.3s ease",
    cursor: "pointer"
  };

  const deleteButtonStyle = {
    background: "linear-gradient(45deg, #dc3545, #c82333)",
    border: "none",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    textTransform: "uppercase",
    boxShadow: "0 4px 15px rgba(220,53,69,0.4)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    marginLeft: "10px"
  };

  const dialogStyle = {
    width: "85vw",
    maxWidth: "1200px",
    maxHeight: "90vh",
    background: "linear-gradient(135deg, #fff5f0, #ffe4d6)",
    borderRadius: "20px",
    border: "3px solid #ff8c00",
    boxShadow: "0 10px 40px rgba(255,140,0,0.4)",
    overflow: "hidden"
  };

  const dialogContentStyle = {
    padding: "30px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "15px",
    margin: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    maxHeight: "75vh",
    overflowY: "auto",
    border: "1px solid #ffcc99"
  };

  const closeButtonStyle = {
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
  };

  const renderPostCard = (post) => (
    <div key={post.id} className="p-col-12 p-md-6 p-lg-3">
      <Card 
        title={post.title} 
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {/* Hình ảnh nhỏ ở bên trái */}

          {post.imageBase64s && post.imageBase64s.length > 0 && (
            <div style={{ flexShrink: 0 }}>
              <img 
                src={formatImageUrl(post.imageBase64s[0]) || getFallbackImage(80, 80, "No+Image")} 

                alt="Hình ảnh phòng"
                style={{ 
                  width: "80px", 
                  height: "80px", 
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #ffcc99",
                  boxShadow: "0 2px 8px rgba(255,140,0,0.3)"
                }}
                onError={(e) => {
                  console.error('Image failed to load:', post.imageBase64s[0]);
                  e.target.src = getFallbackImage(80, 80, "No+Image");
                  e.target.alt = "Không có hình ảnh";
                }}
                onLoad={(e) => {
                  console.log('Image loaded successfully');
                }}
              />
            </div>
          )}
          
          {/* Thông tin ở giữa */}
          <div style={{ flex: 1 }}>
            <p><strong>Địa chỉ:</strong> {post.address}</p>
            <p><strong>Giá thuê:</strong> <span style={{ color: "#ff6600", fontWeight: "bold" }}>{formatPrice(post.price)}</span></p>
            <p><strong>Diện tích:</strong> {formatArea(post.area)}</p>
          </div>

          {/* Nút chi tiết và xóa ở bên phải */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 20px rgba(255,140,0,0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 15px rgba(255,140,0,0.4)";
              }}
              onClick={() => handleViewDetail(post)}
            >
              Chi tiết
            </button>
            
            <button
              style={deleteButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 20px rgba(220,53,69,0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 15px rgba(220,53,69,0.4)";
              }}
              onClick={() => handleDeleteClick(post)}
            >
              Xóa
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDetailDialog = () => (
    <Dialog
      header={null}
      visible={showDetailDialog}
      style={{
        ...dialogStyle,
        position: "relative"
      }}
      onHide={() => setShowDetailDialog(false)}
      modal
      draggable={false}
      resizable={false}
      showHeader={false}
      contentStyle={{
        padding: "0",
        border: "none",
        borderRadius: "20px",
        overflow: "hidden"
      }}
      maskStyle={{
        backgroundColor: "rgba(0,0,0,0.6)"
      }}
    >
      {selectedPost && (
        <div style={{ position: "relative" }}>
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
                ...closeButtonStyle,
                top: "20px",
                right: "20px"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 0, 0, 1)";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 0, 0, 0.8)";
                e.target.style.transform = "scale(1)";
              }}
              onClick={() => setShowDetailDialog(false)}
            >
              ✕
            </button>
          </div>
          
          <div style={dialogContentStyle}>
            <div style={{ borderBottom: "3px solid #ff8c00", paddingBottom: "20px", marginBottom: "25px" }}>
              <h3 style={{ color: "#ff8c00", margin: "0", fontSize: "20px", textAlign: "center" }}>Thông tin cơ bản</h3>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Tiêu đề:</strong></p>
                <p style={{ color: "#ff6600", fontWeight: "bold", margin: "5px 0" }}>{selectedPost.title}</p>
              </div>
              
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Giá thuê:</strong></p>
                <p style={{ color: "#ff6600", fontWeight: "bold", fontSize: "16px", margin: "5px 0" }}>{formatPrice(selectedPost.price)}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Diện tích:</strong></p>
                <p style={{ color: "#333", margin: "5px 0" }}>{formatArea(selectedPost.area)}</p>
              </div>
              
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Đặt cọc:</strong></p>
                <p style={{ color: "#333", margin: "5px 0" }}>{selectedPost.deposit || 'Không yêu cầu'}</p>
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Địa chỉ:</strong></p>
                <p style={{ color: "#333", margin: "5px 0" }}>{selectedPost.address}</p>
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Mô tả:</strong></p>
                <p style={{ color: "#333", margin: "5px 0", lineHeight: "1.5" }}>{selectedPost.description}</p>
              </div>
            </div>

            {/* Hiển thị hình ảnh trong phần thông tin cơ bản */}

            {selectedPost.imageBase64s && selectedPost.imageBase64s.length > 0 && (

              <div style={{ marginBottom: "25px" }}>
                <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                  <p style={{ margin: "5px 0 15px 0" }}><strong style={{ color: "#333" }}>Hình ảnh:</strong></p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

                    {selectedPost.imageBase64s.map((imageUrl, index) => (

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
                            console.error('Modal image failed to load:', imageUrl);
                            e.target.src = getFallbackImage(100, 100, "No+Image");
                            e.target.alt = "Không thể tải hình ảnh";
                          }}
                          onLoad={(e) => {
                            console.log('Modal image loaded successfully');
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
                <p style={{ color: "#333", margin: "5px 0" }}>{selectedPost.genderRequirement || 'Không yêu cầu'}</p>
              </div>
              
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Thang máy:</strong></p>
                <p style={{ color: "#333", margin: "5px 0" }}>{selectedPost.elevator || 'Không có'}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Tiện ích:</strong></p>
                <p style={{ color: "#333", margin: "5px 0" }}>{selectedPost.utilities || 'Không có'}</p>
              </div>
              
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Nội thất:</strong></p>
                <p style={{ color: "#333", margin: "5px 0" }}>{selectedPost.furniture || 'Không có'}</p>
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
                <p style={{ margin: "5px 0" }}><strong style={{ color: "#333" }}>Thông tin liên hệ:</strong></p>
                <p style={{ color: "#333", margin: "5px 0" }}>{selectedPost.contact || 'Không có'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );

  const currentPosts = posts.slice(first, first + rows);

  return (
    <SidebarNav>
      <div style={{ margin: "2rem" }}>
        <h1 style={{ color: "#ff8c00", textAlign: "center", marginBottom: "2rem" }}>Bài đăng của tôi</h1>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <i className="pi pi-spin pi-spinner mr-2" />
            <span>Đang tải...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <i className="pi pi-exclamation-circle mr-2" />
              <span className="font-medium">Lỗi:</span>
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-8">
            <i className="pi pi-file text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có bài đăng nào</h3>
            <p className="text-gray-500 mb-4">Bắt đầu tạo bài đăng đầu tiên của bạn</p>
            <button
              style={buttonStyle}
              onClick={() => window.location.href = '/add-apartment'}
            >
              Tạo bài đăng
            </button>
          </div>
        )}

        {/* Posts List */}
        {!loading && !error && posts.length > 0 && (
          <>
            <div className="p-grid">
              {currentPosts.map(renderPostCard)}
            </div>

            {posts.length > rows && (
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <Paginator
                  first={first}
                  rows={rows}
                  totalRecords={posts.length}
                  onPageChange={onPageChange}
                  template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                  currentPageReportTemplate="Trang {currentPage} / {totalPages}"
                  style={{
                    background: "#fff5f0",
                    border: "1px solid #ff8c00",
                    borderRadius: "8px",
                    padding: "10px"
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Dialog */}
      {renderDetailDialog()}

      {/* Delete Confirmation Dialog */}
      <Dialog
        header={null}
        visible={showDeleteConfirm}
        style={{ 
          width: '500px',
          borderRadius: '15px',
          overflow: 'hidden'
        }}
        onHide={handleCancelDelete}
        modal
        draggable={false}
        resizable={false}
        showHeader={false}
        contentStyle={{
          padding: '0',
          border: 'none',
          borderRadius: '15px',
          background: 'linear-gradient(135deg, #fff5f5, #ffe8e8)',
          boxShadow: '0 10px 40px rgba(220, 53, 69, 0.3)'
        }}
        maskStyle={{
          backgroundColor: 'rgba(0,0,0,0.7)'
        }}
      >
        <div style={{ 
          background: 'linear-gradient(135deg, #fff5f5, #ffe8e8)',
          border: '3px solid #dc3545',
          borderRadius: '15px',
          overflow: 'hidden'
        }}>
          {/* Header với màu đỏ */}
          <div style={{ 
            background: 'linear-gradient(45deg, #dc3545, #c82333)', 
            color: 'white', 
            padding: '20px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '24px', marginRight: '10px' }} />
            Xác nhận xóa
          </div>
          
          {/* Nội dung */}
          <div style={{ 
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.95)',
            margin: '15px',
            borderRadius: '10px',
            border: '1px solid #ffcccc'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <i 
                className="pi pi-trash" 
                style={{ 
                  fontSize: '3rem', 
                  color: '#dc3545',
                  marginBottom: '15px',
                  background: '#fff5f5',
                  padding: '20px',
                  borderRadius: '50%',
                  border: '3px solid #dc3545'
                }}
              />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '10px 0' }}>
                Bạn có chắc chắn muốn xóa bài đăng này?
              </h3>
              {postToDelete && (
                <div style={{ 
                  background: '#fff5f5', 
                  padding: '15px', 
                  borderRadius: '8px',
                  border: '1px solid #ffcccc',
                  marginTop: '15px'
                }}>
                  <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                    <strong style={{ color: '#333' }}>Địa chỉ:</strong> {postToDelete.address}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                    <strong style={{ color: '#333' }}>Giá thuê:</strong> {postToDelete.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(postToDelete.price) : 'N/A'}
                  </p>
                </div>
              )}
              <p style={{ 
                fontSize: '14px', 
                color: '#dc3545', 
                fontWeight: 'bold',
                marginTop: '15px',
                background: '#fff5f5',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #dc3545'
              }}>
                ⚠️ Hành động này không thể hoàn tác!
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
              <button
                style={{
                  background: 'linear-gradient(45deg, #6c757d, #545b62)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(108, 117, 125, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(108, 117, 125, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(108, 117, 125, 0.4)';
                }}
                onClick={handleCancelDelete}
                disabled={deleteLoading}
              >
                Hủy bỏ
              </button>
              
              <button
                style={{
                  background: deleteLoading ? '#ccc' : 'linear-gradient(45deg, #dc3545, #c82333)',
                  border: 'none',
                  color: 'white',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  flex: 1,
                  fontSize: '16px',
                  boxShadow: deleteLoading ? 'none' : '0 4px 15px rgba(220, 53, 69, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!deleteLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deleteLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.4)';
                  }
                }}
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <i className="pi pi-spin pi-spinner" style={{ marginRight: '8px' }} />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <i className="pi pi-trash" style={{ marginRight: '8px' }} />
                    Xác nhận xóa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Toast for notifications */}
      <Toast ref={toast} />
    </SidebarNav>
  );
};

export default Posts;