import React, { useEffect, useState } from "react";
import { Modal, Button, Typography, Row, Col, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  filterRoommatePostsApi,
  getAllRoommatePostsApi,
  getRoommatePostByIdApi,
  getUserProfileApi,
} from "../../services/Userservices";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import CreateRoommatePostModal from "./CreateRoommatePostModal";

const { Title, Paragraph, Text } = Typography;

export default function RoommatePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async (filterPayload) => {
    try {
      const res = filterPayload
        ? await filterRoommatePostsApi(filterPayload)
        : await getAllRoommatePostsApi();
      setPosts(res.data);
    } catch (err) {
      message.error("Không thể tải danh sách bài đăng");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredPostsByUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const decoded = jwtDecode(token);
      const profile = await getUserProfileApi(decoded.id);

      const payload = {
        gender: profile.gender || undefined,
        occupation: profile.occupation || undefined,
        canCook:
          profile.cookFrequency === "OFTEN"
            ? "YES"
            : profile.cookFrequency === "NEVER"
              ? "NO"
              : undefined,
        isNightOwl:
          profile.sleepHabit === "NIGHT_OWL"
            ? "YES"
            : profile.sleepHabit === "EARLY_SLEEPER"
              ? "NO"
              : undefined,
        hasPet: profile.pets || undefined,
        smokes: profile.smoking || undefined,
        bringsFriends: profile.inviteFriends || undefined,
      };

      await fetchPosts(payload);
    } catch (err) {
      message.error("Không thể lọc theo hồ sơ cá nhân");
    }
  };

  useEffect(() => {
    fetchFilteredPostsByUserProfile();
  }, []);

  const openDetailModal = async (postId) => {
    try {
      const res = await getRoommatePostByIdApi(postId);
      setSelectedPost(res.data);
      setOpenDetail(true);
    } catch (err) {
      message.error("Không thể tải chi tiết bài đăng");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10 ml-60 mr-60">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="text-orange-500">
          Danh sách bài đăng tìm bạn ở ghép
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 border-orange-500"
          onClick={() => setOpenCreateModal(true)}
        >
          Đăng bài tìm bạn
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {posts.map((post) => (
          <Col xs={24} sm={12} md={8} key={post.id}>
            <div
              onClick={() => openDetailModal(post.id)}
              className="bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
            >
              <img
                src={post.imageUrls[0] || "/default.jpg"}
                alt="roommate"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">
                  {post.ownerPost}
                </h3>
                <p className="text-sm text-gray-600">{post.address}</p>
                <p className="text-sm">
                  <strong>Diện tích:</strong> {post.areaSquareMeters} m²
                </p>
                <p className="text-sm">
                  <strong>Giá thuê:</strong> {post.monthlyRentPrice} VND
                </p>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Modal chi tiết */}
      <Modal
        open={openDetail}
        title="Chi tiết bài đăng"
        footer={null}
        onCancel={() => setOpenDetail(false)}
      >
        {selectedPost && (
          <div>
            <img
              src={selectedPost.imageUrls[0] || "/default.jpg"}
              alt="roommate"
              className="w-full h-60 object-cover rounded mb-4"
            />
            <Title level={4}>{selectedPost.ownerPost}</Title>
            <Text strong>Địa chỉ:</Text> {selectedPost.address} <br />
            <Text strong>Diện tích:</Text> {selectedPost.areaSquareMeters} m²{" "}
            <br />
            <Text strong>Giá thuê:</Text> {selectedPost.monthlyRentPrice} VND{" "}
            <br />
            <Paragraph>{selectedPost.description}</Paragraph>
            <Text type="secondary">Ngày đăng: {selectedPost.createdDate}</Text>
            {selectedPost.roommatePreferences &&
              selectedPost.roommatePreferences.length > 0 && (
                <>
                  <Title level={5} className="mt-4">
                    Thông tin người đăng
                  </Title>
                  {selectedPost.roommatePreferences.map((pref, idx) => (
                    <div
                      key={idx}
                      className="border rounded p-3 mb-3 bg-gray-50"
                    >
                      <p>
                        <strong>Tên:</strong> {pref.name}
                      </p>
                      <p>
                        <strong>Năm sinh:</strong> {pref.dateOfBirth}
                      </p>
                      <p>
                        <strong>Giới tính:</strong>{" "}
                        {pref.gender === "MALE"
                          ? "Nam"
                          : pref.gender === "FEMALE"
                            ? "Nữ"
                            : "Không yêu cầu"}
                      </p>
                      <p>
                        <strong>Nghề nghiệp:</strong>{" "}
                        {pref.occupation === "STUDENT"
                          ? "Sinh viên"
                          : pref.occupation === "OFFICE_WORKER"
                            ? "Nhân viên văn phòng"
                            : pref.occupation === "FREELANCER"
                              ? "Freelancer"
                              : pref.occupation === "OTHER"
                                ? "Khác"
                                : "Không rõ"}
                      </p>
                      <p>
                        <strong>Biết nấu ăn:</strong>{" "}
                        {pref.canCook === "YES" ? "Có" : "Không"}
                      </p>
                      <p>
                        <strong>Cú đêm:</strong>{" "}
                        {pref.isNightOwl === "YES" ? "Có" : "Không"}
                      </p>
                      <p>
                        <strong>Nuôi thú cưng:</strong>{" "}
                        {pref.hasPet === "YES" ? "Có" : "Không"}
                      </p>
                      <p>
                        <strong>Hút thuốc:</strong>{" "}
                        {pref.smokes === "YES" ? "Có" : "Không"}
                      </p>
                      <p>
                        <strong>Thường rủ bạn về:</strong>{" "}
                        {pref.oftenBringsFriendsOver === "YES" ? "Có" : "Không"}
                      </p>
                    </div>
                  ))}
                </>
              )}
            <Button
              type="primary"
              className="bg-orange-500 border-orange-500 mt-4"
              block
              onClick={() =>
                navigate("/roommates", {
                  state: { chatWith: selectedPost.userId },
                })
              }
            >
              Liên hệ ngay
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal tạo bài đăng */}
      <CreateRoommatePostModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={fetchFilteredPostsByUserProfile}
      />
    </div>
  );
}
