import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import SidebarNav from "../components/layouts/SidebarNav";
import { getMyApartmentsApi, getMyApartmentsCountApi } from "../services/Userservices";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatArea = (area) => {
    return `${area} m²`;
  };

  const renderPostCard = (post) => (
    <Card key={post.id} className="mb-4">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={post.imageUrls?.[0] || '/placeholder-image.jpg'}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
            <Tag value={formatPrice(post.price)} severity="success" />
          </div>
          
          <p className="text-gray-600 mb-2 line-clamp-2">{post.description}</p>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <i className="pi pi-map-marker" />
            <span>{post.address}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <i className="pi pi-ruler" />
              {formatArea(post.area)}
            </span>
            <span className="flex items-center gap-1">
              <i className="pi pi-users" />
              {post.genderRequirement || 'Không yêu cầu'}
            </span>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="flex-shrink-0">
          <Button
            label="Chi tiết"
            icon="pi pi-eye"
            className="border-2 border-orange-500 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-200"
            onClick={() => handleViewDetail(post)}
          />
        </div>
      </div>
    </Card>
  );

  const renderDetailDialog = () => (
    <Dialog
      header={
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-2xl font-bold text-orange-600 tracking-wide uppercase">Chi tiết bài đăng</span>
        </div>
      }
      visible={showDetailDialog}
      onHide={() => setShowDetailDialog(false)}
      style={{ width: '90vw', maxWidth: '800px' }}
      modal
      className="p-fluid bg-white rounded-2xl shadow-2xl border border-gray-200"
      closeIcon={<i className="pi pi-times text-2xl text-gray-500 hover:text-red-500 transition-colors" style={{marginRight: '12px', marginTop: '8px'}} />}
    >
      {selectedPost && (
        <div className="space-y-6 bg-white rounded-xl p-4">
          {/* Images */}
          {selectedPost.imageUrls && selectedPost.imageUrls.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Hình ảnh</h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedPost.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${selectedPost.title} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Tiêu đề</label>
              <p className="text-gray-700">{selectedPost.title}</p>
            </div>
            <div>
              <label className="font-semibold">Giá</label>
              <p className="text-gray-700">{formatPrice(selectedPost.price)}</p>
            </div>
            <div>
              <label className="font-semibold">Diện tích</label>
              <p className="text-gray-700">{formatArea(selectedPost.area)}</p>
            </div>
            <div>
              <label className="font-semibold">Đặt cọc</label>
              <p className="text-gray-700">{selectedPost.deposit || 'Không yêu cầu'}</p>
            </div>
            <div>
              <label className="font-semibold">Yêu cầu giới tính</label>
              <p className="text-gray-700">{selectedPost.genderRequirement || 'Không yêu cầu'}</p>
            </div>
            <div>
              <label className="font-semibold">Thang máy</label>
              <p className="text-gray-700">{selectedPost.elevator || 'Không có'}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold">Mô tả</label>
            <p className="text-gray-700">{selectedPost.description}</p>
          </div>

          {/* Address */}
          <div>
            <label className="font-semibold">Địa chỉ</label>
            <p className="text-gray-700">{selectedPost.address}</p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Tiện ích</label>
              <p className="text-gray-700">{selectedPost.utilities || 'Không có'}</p>
            </div>
            <div>
              <label className="font-semibold">Nội thất</label>
              <p className="text-gray-700">{selectedPost.furniture || 'Không có'}</p>
            </div>
            <div>
              <label className="font-semibold">Tình trạng nội thất</label>
              <p className="text-gray-700">{selectedPost.interiorCondition || 'Không có'}</p>
            </div>
            <div>
              <label className="font-semibold">Giấy tờ pháp lý</label>
              <p className="text-gray-700">{selectedPost.legalDocuments || 'Không có'}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="font-semibold">Thông tin liên hệ</label>
            <p className="text-gray-700">{selectedPost.contact || 'Không có'}</p>
          </div>
        </div>
      )}
    </Dialog>
  );

  return (
    <SidebarNav>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bài đăng của tôi</h2>
              <p className="text-gray-600">Tổng cộng {count} bài đăng</p>
            </div>
            <Button
              label="Tạo bài đăng mới"
              icon="pi pi-plus"
              className="border-2 border-green-600 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-200"
              onClick={() => window.location.href = '/add-apartment'}
            />
          </div>

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
              <Button
                label="Tạo bài đăng"
                icon="pi pi-plus"
                className="border-2 border-green-600 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-200"
                onClick={() => window.location.href = '/add-apartment'}
              />
            </div>
          )}

          {/* Posts List */}
          {!loading && !error && posts.length > 0 && (
            <div className="space-y-4">
              {posts.map(renderPostCard)}
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      {renderDetailDialog()}
    </SidebarNav>
  );
};

export default Posts;