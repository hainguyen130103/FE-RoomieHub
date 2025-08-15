import React, { useState, useEffect } from "react";
import { getMyRoommatePostsApi } from "../services/Userservices";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Paginator } from "primereact/paginator";
import SidebarNav from "../components/layouts/SidebarNav";
import { formatImageUrl, getFallbackImage } from "../utils/imageUtils";

const Roommates = () => {
  const [posts, setPosts] = useState([]);
  const [display, setDisplay] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows] = useState(4);

  useEffect(() => {
    getMyRoommatePostsApi()
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi lấy dữ liệu bài đăng:", error);
      });
  }, []);

  const onPageChange = (event) => {
    setFirst(event.first);
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

                  {/* Nút chi tiết ở bên phải */}
                  <div style={{ flexShrink: 0 }}>
                    <button
                      style={buttonStyle}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";

                        e.target.style.boxShadow =
                          "0 6px 20px rgba(255,140,0,0.6)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow =
                          "0 4px 15px rgba(255,140,0,0.4)";
                      }}
                      onClick={() => {
                        setSelectedPost(post);
                        setDisplay(true);
                      }}
                    >
                      Chi tiết
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
      </div>
    </SidebarNav>
  );
};

export default Roommates;
