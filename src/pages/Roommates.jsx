import React, { useState, useEffect, useRef } from "react";
import { getMyRoommatePostsApi, updateRoommatePostApi, deleteRoommatePostApi } from "../services/Userservices";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import SidebarNav from "../components/layouts/SidebarNav";
import { formatImageUrl, getFallbackImage } from "../utils/imageUtils";

const Roommates = () => {
  const [posts, setPosts] = useState([]);
  const [display, setDisplay] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows] = useState(4);
  
  // States for update functionality
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    address: '',
    areaSquareMeters: '',
    monthlyRentPrice: '',
    description: '',
    imageBase64List: [],
    roommatePreferences: []
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // States for delete functionality
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const toast = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getMyRoommatePostsApi();
      setPosts(response.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu bài đăng:", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải danh sách bài đăng',
        life: 5000
      });
    }
  };

  const onPageChange = (event) => {
    setFirst(event.first);
  };

  // Handle Update
  const handleUpdateClick = (post) => {
    setPostToUpdate(post);
    setUpdateForm({
      address: post.address || '',
      areaSquareMeters: post.areaSquareMeters || '',
      monthlyRentPrice: post.monthlyRentPrice || '',
      description: post.description || '',
      imageBase64List: post.imageBase64List || [''],
      roommatePreferences: post.roommatePreferences ? post.roommatePreferences.map(pref => ({
        name: pref.name || '',
        dateOfBirth: pref.dateOfBirth || '',
        gender: pref.gender || 'MALE',
        occupation: pref.occupation || 'STUDENT',
        description: pref.description || '',
        preferredPersonality: pref.preferredPersonality || 'QUIET',
        canCook: pref.canCook || 'NO',
        isNightOwl: pref.isNightOwl || 'NO',
        hasPet: pref.hasPet || 'NO',
        smokes: pref.smokes || 'NO',
        oftenBringsFriendsOver: pref.oftenBringsFriendsOver || 'NO'
      })) : []
    });
    setShowUpdateDialog(true);
  };

  const handleUpdateFormChange = (field, value) => {
    setUpdateForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRoommatePreferenceChange = (index, field, value) => {
    const newPreferences = [...updateForm.roommatePreferences];
    newPreferences[index] = { ...newPreferences[index], [field]: value };
    setUpdateForm(prev => ({ ...prev, roommatePreferences: newPreferences }));
  };

  const addRoommatePreference = () => {
    const newPreference = {
      name: '',
      dateOfBirth: '',
      gender: 'MALE',
      occupation: 'STUDENT',
      description: '',
      preferredPersonality: 'QUIET',
      canCook: 'NO',
      isNightOwl: 'NO',
      hasPet: 'NO',
      smokes: 'NO',
      oftenBringsFriendsOver: 'NO'
    };
    setUpdateForm(prev => ({
      ...prev,
      roommatePreferences: [...prev.roommatePreferences, newPreference]
    }));
  };

  const removeRoommatePreference = (index) => {
    const newPreferences = [...updateForm.roommatePreferences];
    newPreferences.splice(index, 1);
    setUpdateForm(prev => ({ ...prev, roommatePreferences: newPreferences }));
  };

  const handleImageUpdate = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageList = [...updateForm.imageBase64List];
        newImageList[index] = reader.result;
        setUpdateForm(prev => ({ ...prev, imageBase64List: newImageList }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageList = [...updateForm.imageBase64List];
        newImageList[index] = reader.result;
        setUpdateForm(prev => ({ ...prev, imageBase64List: newImageList }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setUpdateForm(prev => ({
      ...prev,
      imageBase64List: [...prev.imageBase64List, '']
    }));
  };

  const removeImageField = (index) => {
    if (updateForm.imageBase64List && updateForm.imageBase64List.length > 1) {
      const newImageList = [...updateForm.imageBase64List];
      newImageList.splice(index, 1);
      setUpdateForm(prev => ({ ...prev, imageBase64List: newImageList }));
    }
  };

  const handleConfirmUpdate = async () => {
    if (!postToUpdate) return;
    
    try {
      setUpdateLoading(true);
      
      const payload = {
        address: updateForm.address,
        areaSquareMeters: parseFloat(updateForm.areaSquareMeters),
        monthlyRentPrice: parseFloat(updateForm.monthlyRentPrice),
        description: updateForm.description,
        imageBase64List: updateForm.imageBase64List ? updateForm.imageBase64List.filter(img => img) : [],
        roommatePreferences: updateForm.roommatePreferences ? updateForm.roommatePreferences.map(pref => ({
          name: pref.name || "",
          dateOfBirth: pref.dateOfBirth || "",
          gender: pref.gender || "MALE",
          occupation: pref.occupation || "STUDENT",
          description: pref.description || "",
          preferredPersonality: pref.preferredPersonality || "QUIET",
          canCook: pref.canCook || "NO",
          isNightOwl: pref.isNightOwl || "NO",
          hasPet: pref.hasPet || "NO",
          smokes: pref.smokes || "NO",
          oftenBringsFriendsOver: pref.oftenBringsFriendsOver || "NO"
        })) : []
      };

      console.log("Payload gửi lên API:", JSON.stringify(payload, null, 2));

      await updateRoommatePostApi(postToUpdate.id, payload);
      
      // Refresh data
      await fetchPosts();
      
      // Close dialog and reset
      setShowUpdateDialog(false);
      setPostToUpdate(null);
      setUpdateForm({});
      
      // Success toast
      toast.current?.show({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Cập nhật bài đăng thành công!',
        life: 3000
      });
    } catch (err) {
      console.error('Error updating post:', err);
      toast.current?.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Có lỗi xảy ra khi cập nhật bài đăng: ' + err.message,
        life: 5000
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    setShowUpdateDialog(false);
    setPostToUpdate(null);
    setUpdateForm({});
  };

  // Handle Delete
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      setDeleteLoading(true);
      await deleteRoommatePostApi(postToDelete.id);
      
      // Refresh data
      await fetchPosts();
      
      // Close dialog and reset
      setShowDeleteConfirm(false);
      setPostToDelete(null);
      
      // Success toast
      toast.current?.show({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Xóa bài đăng thành công!',
        life: 3000
      });
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.current?.show({
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

  const cardStyle = {
    backgroundColor: "white",
    border: "2px solid #ff8c00",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(255,140,0,0.3)",
    margin: "1rem",
    padding: "1.5rem",
    color: "black",

    transition: "transform 0.3s ease",
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
    cursor: "pointer",
  };

  const updateButtonStyle = {
    background: "linear-gradient(45deg, #28a745, #218838)",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    textTransform: "uppercase",
    boxShadow: "0 4px 15px rgba(40,167,69,0.4)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    fontSize: "12px",
    margin: "5px"
  };

  const deleteButtonStyle = {
    background: "linear-gradient(45deg, #dc3545, #c82333)",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    textTransform: "uppercase",
    boxShadow: "0 4px 15px rgba(220,53,69,0.4)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    fontSize: "12px",
    margin: "5px"
  };

  const dialogStyle = {
    width: "85vw",
    maxWidth: "1200px",
    maxHeight: "90vh",
    background: "linear-gradient(135deg, #fff5f0, #ffe4d6)",
    borderRadius: "20px",
    border: "3px solid #ff8c00",
    boxShadow: "0 10px 40px rgba(255,140,0,0.4)",

    overflow: "hidden",
  };

  const dialogContentStyle = {
    padding: "30px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "15px",
    margin: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    maxHeight: "75vh",
    overflowY: "auto",

    border: "1px solid #ffcc99",
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

    zIndex: 1000,
  };

  const renderDialogContent = () => {
    if (!selectedPost) return null;
    return (
      <div style={dialogContentStyle}>
        <div
          style={{
            borderBottom: "3px solid #ff8c00",
            paddingBottom: "20px",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              color: "#ff8c00",
              margin: "0",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            Thông tin cơ bản
          </h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              padding: "15px",
              background: "#fff8f0",
              borderRadius: "8px",
              border: "1px solid #ffcc99",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#333" }}>Tên chủ trọ:</strong>
            </p>
            <p
              style={{ color: "#ff6600", fontWeight: "bold", margin: "5px 0" }}
            >
              {selectedPost.ownerPost}
            </p>
          </div>

          <div
            style={{
              padding: "15px",
              background: "#fff8f0",
              borderRadius: "8px",
              border: "1px solid #ffcc99",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#333" }}>Giá thuê:</strong>
            </p>
            <p
              style={{
                color: "#ff6600",
                fontWeight: "bold",
                fontSize: "16px",
                margin: "5px 0",
              }}
            >
              {selectedPost.monthlyRentPrice} VND/tháng
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              padding: "15px",
              background: "#fff8f0",
              borderRadius: "8px",
              border: "1px solid #ffcc99",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#333" }}>Diện tích:</strong>
            </p>
            <p style={{ color: "#333", margin: "5px 0" }}>
              {selectedPost.areaSquareMeters} m²
            </p>
          </div>

          <div
            style={{
              padding: "15px",
              background: "#fff8f0",
              borderRadius: "8px",
              border: "1px solid #ffcc99",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#333" }}>Ngày tạo:</strong>
            </p>
            <p style={{ color: "#333", margin: "5px 0" }}>
              {selectedPost.createdDate}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              padding: "15px",
              background: "#fff8f0",
              borderRadius: "8px",
              border: "1px solid #ffcc99",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#333" }}>Địa chỉ:</strong>
            </p>
            <p style={{ color: "#333", margin: "5px 0" }}>
              {selectedPost.address}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              padding: "15px",
              background: "#fff8f0",
              borderRadius: "8px",
              border: "1px solid #ffcc99",
            }}
          >
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#333" }}>Mô tả:</strong>
            </p>
            <p style={{ color: "#333", margin: "5px 0", lineHeight: "1.5" }}>
              {selectedPost.description}
            </p>
          </div>
        </div>

        {/* Hiển thị hình ảnh trong phần thông tin cơ bản */}

        {selectedPost.imageBase64List && selectedPost.imageBase64List.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <div style={{ padding: "15px", background: "#fff8f0", borderRadius: "8px", border: "1px solid #ffcc99" }}>
              <p style={{ margin: "5px 0 15px 0" }}><strong style={{ color: "#333" }}>Hình ảnh:</strong></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {selectedPost.imageBase64List.map((imageUrl, index) => (
                  <div key={index} style={{ 
                    borderRadius: "8px", 
                    overflow: "hidden", 
                    boxShadow: "0 2px 8px rgba(255,140,0,0.3)",
                    border: "2px solid #ffcc99",
                    flexShrink: 0
                  }}>
                    <img 
                      src={formatImageUrl(imageUrl)} 
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
                        e.target.src = getFallbackImage(100, 100, "No+Image");
                        e.target.alt = "Không thể tải hình ảnh";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {selectedPost.roommatePreferences &&
          selectedPost.roommatePreferences.length > 0 && (
            <div>
              <div
                style={{
                  borderBottom: "3px solid #ff8c00",
                  paddingBottom: "20px",
                  marginBottom: "25px",
                }}
              >
                <h3
                  style={{
                    color: "#ff8c00",
                    margin: "0",
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  Thông tin Roommate
                </h3>
              </div>
              {selectedPost.roommatePreferences.map((pref) => (
                <div
                  key={pref.id}
                  style={{
                    marginBottom: "25px",
                    padding: "20px",
                    background: "linear-gradient(135deg, #fff5f0, #ffe8d6)",
                    borderRadius: "12px",
                    border: "2px solid #ffcc99",
                    boxShadow: "0 4px 10px rgba(255,140,0,0.2)",
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h4
                      style={{
                        color: "#ff6600",
                        margin: "0",
                        fontSize: "18px",
                      }}
                    >
                      {pref.name}
                    </h4>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <strong style={{ color: "#333" }}>Ngày sinh:</strong>
                      <p style={{ margin: "5px 0 0 0", color: "#555" }}>
                        {pref.dateOfBirth}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <strong style={{ color: "#333" }}>Giới tính:</strong>
                      <p style={{ margin: "5px 0 0 0", color: "#555" }}>
                        {pref.gender === "MALE" ? "Nam" : "Nữ"}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <strong style={{ color: "#333" }}>Nghề nghiệp:</strong>
                      <p style={{ margin: "5px 0 0 0", color: "#555" }}>
                        {pref.occupation}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <strong style={{ color: "#333" }}>Tính cách:</strong>
                      <p style={{ margin: "5px 0 0 0", color: "#555" }}>
                        {pref.preferredPersonality === "QUIET"
                          ? "Yên tĩnh"
                          : pref.preferredPersonality}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "8px",
                        borderRadius: "6px",
                        textAlign: "center",
                      }}
                    >
                      <strong style={{ color: "#333", fontSize: "14px" }}>
                        Nấu ăn:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: pref.canCook === "YES" ? "#28a745" : "#dc3545",
                          fontWeight: "bold",
                        }}
                      >
                        {pref.canCook === "YES" ? "✓ Có" : "✗ Không"}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "8px",
                        borderRadius: "6px",
                        textAlign: "center",
                      }}
                    >
                      <strong style={{ color: "#333", fontSize: "14px" }}>
                        Thức khuya:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color:
                            pref.isNightOwl === "YES" ? "#28a745" : "#dc3545",
                          fontWeight: "bold",
                        }}
                      >
                        {pref.isNightOwl === "YES" ? "✓ Có" : "✗ Không"}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "8px",
                        borderRadius: "6px",
                        textAlign: "center",
                      }}
                    >
                      <strong style={{ color: "#333", fontSize: "14px" }}>
                        Nuôi thú cưng:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: pref.hasPet === "YES" ? "#28a745" : "#dc3545",
                          fontWeight: "bold",
                        }}
                      >
                        {pref.hasPet === "YES" ? "✓ Có" : "✗ Không"}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "8px",
                        borderRadius: "6px",
                        textAlign: "center",
                      }}
                    >
                      <strong style={{ color: "#333", fontSize: "14px" }}>
                        Hút thuốc:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color: pref.smokes === "YES" ? "#dc3545" : "#28a745",
                          fontWeight: "bold",
                        }}
                      >
                        {pref.smokes === "YES" ? "✗ Có" : "✓ Không"}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        padding: "8px",
                        borderRadius: "6px",
                        textAlign: "center",
                        gridColumn: "span 2",
                      }}
                    >
                      <strong style={{ color: "#333", fontSize: "14px" }}>
                        Mời bạn bè:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          color:
                            pref.oftenBringsFriendsOver === "YES"
                              ? "#ffc107"
                              : "#28a745",
                          fontWeight: "bold",
                        }}
                      >
                        {pref.oftenBringsFriendsOver === "YES"
                          ? "⚠ Thường xuyên"
                          : "✓ Ít khi"}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #ffcc99",
                    }}
                  >
                    <strong style={{ color: "#333" }}>Mô tả chi tiết:</strong>
                    <p
                      style={{
                        margin: "10px 0 0 0",
                        color: "#555",
                        lineHeight: "1.6",
                        fontStyle: "italic",
                      }}
                    >
                      {pref.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    );
  };

  const currentPosts = posts.slice(first, first + rows);

  return (
    <SidebarNav>
      <div style={{ margin: "2rem" }}>
        <h1
          style={{
            color: "#ff8c00",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Bài đăng Roommate của tôi
        </h1>

        <div className="p-grid">
          {currentPosts.map((post) => (
            <div key={post.id} className="p-col-12 p-md-6 p-lg-3">
              <Card
                title={post.ownerPost}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{ display: "flex", gap: "15px", alignItems: "center" }}
                >
                  {/* Hình ảnh nhỏ ở bên trái */}
                  {post.imageBase64List && post.imageBase64List.length > 0 && (
                    <div style={{ flexShrink: 0 }}>

                      <img 
                        src={formatImageUrl(post.imageBase64List[0])} 

                        alt="Hình ảnh phòng"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #ffcc99",
                          boxShadow: "0 2px 8px rgba(255,140,0,0.3)",
                        }}
                        onError={(e) => {

                          e.target.src = getFallbackImage(80, 80, "No+Image");

                          e.target.alt = "Không có hình ảnh";
                        }}
                      />
                    </div>
                  )}

                  {/* Thông tin ở giữa */}
                  <div style={{ flex: 1 }}>
                    <p>
                      <strong>Địa chỉ:</strong> {post.address}
                    </p>
                    <p>
                      <strong>Giá thuê:</strong>{" "}
                      <span style={{ color: "#ff6600", fontWeight: "bold" }}>
                        {post.monthlyRentPrice}
                      </span>
                    </p>
                    <p>
                      <strong>Mô tả:</strong> {post.description}
                    </p>
                  </div>

                  {/* Nút chi tiết, sửa và xóa ở bên phải */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
                      onClick={() => {
                        setSelectedPost(post);
                        setDisplay(true);
                      }}
                    >
                      Chi tiết
                    </button>
                    
                    <button
                      style={updateButtonStyle}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.boxShadow = "0 6px 20px rgba(40,167,69,0.6)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "0 4px 15px rgba(40,167,69,0.4)";
                      }}
                      onClick={() => handleUpdateClick(post)}
                    >
                      Sửa
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
          ))}
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

                padding: "10px",
              }}
            />
          </div>
        )}

        <Dialog
          header={null}
          visible={display}
          style={{
            ...dialogStyle,

            position: "relative",
          }}
          onHide={() => setDisplay(false)}
          modal
          draggable={false}
          resizable={false}
          showHeader={false}
          contentStyle={{
            padding: "0",
            border: "none",
            borderRadius: "20px",

            overflow: "hidden",
          }}
          maskStyle={{
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ position: "relative" }}>
            {/* Header tùy chỉnh với nút đóng */}

            <div
              style={{
                background: "linear-gradient(45deg, #ff8c00, #ff6600)",
                color: "white",
                padding: "25px 70px 25px 25px",
                margin: "0",
                borderRadius: "20px 20px 0 0",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: "bold",
                position: "relative",
                boxShadow: "0 2px 10px rgba(255,140,0,0.3)",
              }}
            >
              Chi tiết bài đăng
              {/* Nút đóng tùy chỉnh */}
              <button
                style={{
                  ...closeButtonStyle,
                  top: "20px",

                  right: "20px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 0, 0, 1)";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 0, 0, 0.8)";
                  e.target.style.transform = "scale(1)";
                }}
                onClick={() => setDisplay(false)}
              >
                ✕
              </button>
            </div>

            {renderDialogContent()}
          </div>
        </Dialog>

        {/* Update Dialog */}
        <Dialog
          header={null}
          visible={showUpdateDialog}
          style={{ 
            width: '90vw',
            maxWidth: '1000px',
            borderRadius: '15px',
            overflow: 'hidden'
          }}
          onHide={handleCancelUpdate}
          modal
          draggable={false}
          resizable={false}
          showHeader={false}
          contentStyle={{
            padding: '0',
            border: 'none',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #f0fff4, #e8f5e8)',
            boxShadow: '0 10px 40px rgba(40, 167, 69, 0.3)'
          }}
          maskStyle={{
            backgroundColor: 'rgba(0,0,0,0.7)'
          }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, #f0fff4, #e8f5e8)',
            border: '3px solid #28a745',
            borderRadius: '15px',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ 
              background: 'linear-gradient(45deg, #28a745, #218838)', 
              color: 'white', 
              padding: '20px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              <i className="pi pi-pencil" style={{ fontSize: '24px', marginRight: '10px' }} />
              Cập nhật bài đăng Roommate
            </div>
            
            {/* Content */}
            <div style={{ 
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.95)',
              margin: '15px',
              borderRadius: '10px',
              border: '1px solid #c3e6cb',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}>
              {/* Basic Apartment Information */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#333', 
                  marginBottom: '20px',
                  borderBottom: '2px solid #28a745',
                  paddingBottom: '10px'
                }}>
                  Thông tin căn hộ
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Địa chỉ:</label>
                    <input
                      type="text"
                      value={updateForm.address || ''}
                      onChange={(e) => handleUpdateFormChange('address', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #c3e6cb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Diện tích (m²):</label>
                      <input
                        type="number"
                        value={updateForm.areaSquareMeters || ''}
                        onChange={(e) => handleUpdateFormChange('areaSquareMeters', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #c3e6cb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Giá thuê/tháng:</label>
                      <input
                        type="number"
                        value={updateForm.monthlyRentPrice || ''}
                        onChange={(e) => handleUpdateFormChange('monthlyRentPrice', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '2px solid #c3e6cb',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                </div>
                </div>

                {/* Cột phải */}
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Mô tả:</label>
                    <textarea
                      value={updateForm.description || ''}
                      onChange={(e) => handleUpdateFormChange('description', e.target.value)}
                      rows={6}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #c3e6cb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Hình ảnh */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>Hình ảnh:</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {updateForm.imageBase64List && updateForm.imageBase64List.map((base64, index) => (
                    <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                      <label
                        htmlFor={`update-image-${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px dashed #c3e6cb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          background: '#f8f9fa'
                        }}
                      >
                        {base64 ? (
                          <img
                            src={formatImageUrl(base64) || getFallbackImage(100, 100, "Image")}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ color: '#28a745', fontSize: '24px' }}>+</span>
                        )}
                      </label>
                      <input
                        id={`update-image-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpdate(e, index)}
                        style={{ display: 'none' }}
                      />
                      {updateForm.imageBase64List && updateForm.imageBase64List.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <div
                    onClick={addImageField}
                    style={{
                      width: '100px',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed #c3e6cb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: '#f8f9fa'
                    }}
                  >
                    <span style={{ color: '#28a745', fontSize: '24px' }}>+</span>
                  </div>
                </div>
              </div>

              {/* Roommate Preferences */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '20px' 
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#333', 
                    margin: 0,
                    borderBottom: '2px solid #ff8c00',
                    paddingBottom: '10px'
                  }}>
                    Thông tin người ở ghép mong muốn
                  </h3>
                  <button
                    type="button"
                    onClick={addRoommatePreference}
                    style={{
                      background: 'linear-gradient(45deg, #ff8c00, #ff7700)',
                      border: 'none',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 8px rgba(255, 140, 0, 0.3)'
                    }}
                  >
                    <i className="pi pi-plus" />
                    Thêm người ở ghép
                  </button>
                </div>

                {updateForm.roommatePreferences && updateForm.roommatePreferences.map((preference, index) => (
                  <div key={index} style={{
                    border: '2px solid #f0f0f0',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    background: 'linear-gradient(135deg, #fff9f0, #fffbf7)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '15px' 
                    }}>
                      <h4 style={{ margin: 0, color: '#ff8c00', fontWeight: 'bold' }}>
                        Người ở ghép #{index + 1}
                      </h4>
                      {updateForm.roommatePreferences && updateForm.roommatePreferences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoommatePreference(index)}
                          style={{
                            background: '#dc3545',
                            border: 'none',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <i className="pi pi-trash" />
                        </button>
                      )}
                    </div>

                    {/* Basic Info Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Tên:
                        </label>
                        <input
                          type="text"
                          value={preference.name || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Ngày sinh:
                        </label>
                        <input
                          type="date"
                          value={preference.dateOfBirth || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'dateOfBirth', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Giới tính:
                        </label>
                        <select
                          value={preference.gender || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'gender', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Chọn giới tính</option>
                          {genderOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Occupation and Personality Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Nghề nghiệp:
                        </label>
                        <select
                          value={preference.occupation || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'occupation', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Chọn nghề nghiệp</option>
                          {occupationOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Tính cách mong muốn:
                        </label>
                        <select
                          value={preference.preferredPersonality || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'preferredPersonality', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Chọn tính cách</option>
                          {personalityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Lifestyle Preferences */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Biết nấu ăn:
                        </label>
                        <select
                          value={preference.canCook || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'canCook', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
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
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Thú cưng:
                        </label>
                        <select
                          value={preference.hasPet || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'hasPet', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
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
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Hút thuốc:
                        </label>
                        <select
                          value={preference.smokes || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'smokes', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
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

                    {/* Additional Preferences */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Thức khuya:
                        </label>
                        <select
                          value={preference.isNightOwl || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'isNightOwl', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
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
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                          Thường đưa bạn về:
                        </label>
                        <select
                          value={preference.oftenBringsFriendsOver || ''}
                          onChange={(e) => handleRoommatePreferenceChange(index, 'oftenBringsFriendsOver', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid #f0c674',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
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

                    {/* Description */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                        Mô tả thêm:
                      </label>
                      <textarea
                        value={preference.description || ''}
                        onChange={(e) => handleRoommatePreferenceChange(index, 'description', e.target.value)}
                        rows={3}
                        placeholder="Mô tả thêm về người ở ghép mong muốn..."
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '2px solid #f0c674',
                          borderRadius: '6px',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  </div>
                ))}

                {updateForm.roommatePreferences && updateForm.roommatePreferences.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '30px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '2px dashed #ddd'
                  }}>
                    <p style={{ color: '#666', margin: '10px 0' }}>
                      Chưa có thông tin người ở ghép mong muốn
                    </p>
                    <button
                      type="button"
                      onClick={addRoommatePreference}
                      style={{
                        background: 'linear-gradient(45deg, #ff8c00, #ff7700)',
                        border: 'none',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Thêm người ở ghép đầu tiên
                    </button>
                  </div>
                )}
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
                  onClick={handleCancelUpdate}
                  disabled={updateLoading}
                >
                  Hủy bỏ
                </button>
                
                <button
                  style={{
                    background: updateLoading ? '#ccc' : 'linear-gradient(45deg, #28a745, #218838)',
                    border: 'none',
                    color: 'white',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: updateLoading ? 'not-allowed' : 'pointer',
                    flex: 1,
                    fontSize: '16px',
                    boxShadow: updateLoading ? 'none' : '0 4px 15px rgba(40, 167, 69, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleConfirmUpdate}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <i className="pi pi-spin pi-spinner" style={{ marginRight: '8px' }} />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <i className="pi pi-check" style={{ marginRight: '8px' }} />
                      Cập nhật
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Dialog>

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
            {/* Header */}
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
            
            {/* Content */}
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
                      <strong style={{ color: '#333' }}>Giá thuê:</strong> {postToDelete.monthlyRentPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(postToDelete.monthlyRentPrice) : 'N/A'}
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
      </div>
    </SidebarNav>
  );
};

// Options for roommate preferences
const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' }
];

const occupationOptions = [
  { label: 'Sinh viên', value: 'STUDENT' },
  { label: 'Nhân viên văn phòng', value: 'OFFICE_WORKER' },
  { label: 'Freelancer', value: 'FREELANCER' },
  { label: 'Khác', value: 'OTHER' }
];

const personalityOptions = [
  { label: 'Yên tĩnh', value: 'QUIET' },
  { label: 'Hướng ngoại', value: 'EXTROVERT' },
  { label: 'Hướng nội', value: 'INTROVERT' },
  { label: 'Cân bằng', value: 'AMBIVERT' }
];

const yesNoOptions = [
  { label: 'Có', value: 'YES' },
  { label: 'Không', value: 'NO' }
];

export default Roommates;
