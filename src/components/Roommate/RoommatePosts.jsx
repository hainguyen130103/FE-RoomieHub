import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Typography,
  Row,
  Col,
  message,
  Carousel,
  Avatar,
  Space,
  Tag,
  Pagination,
  Spin,
} from "antd";
import {
  filterRoommatePostsApi,
  getAllRoommatePostsApi,
  getRoomatePostAuto,
  getRoommatePostByIdApi,
  getUserProfileApi,
} from "../../services/Userservices";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import CreateRoommatePostModal from "./CreateRoommatePostModal";
import {
  HomeOutlined,
  ExpandOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  ManOutlined,
  WomanOutlined,
  CoffeeOutlined,
  MoonOutlined,
  SmileOutlined,
  TeamOutlined,
  CloudOutlined,
  PlusOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function RoommatePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const navigate = useNavigate();
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState(null);
  const [matchRate, setMatchRate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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
  const handleAutoFind = async () => {
    setAutoError(null);
    setAutoLoading(true);
    setLoading(true);
    setMatchRate(null);

    try {
      const res = await getRoomatePostAuto();

      // Nếu API trả về dữ liệu
      if (res && res.data) {
        setPosts(res.data);
        setCurrentPage(1);

        // Tạo số ngẫu nhiên 65-80%
        const randomRate = Math.floor(Math.random() * (80 - 65 + 1)) + 65;
        setMatchRate(randomRate);

        // Hiện modal thông báo kết quả match
        setIsModalVisible(true);
      } else {
        setPosts([]);
        setAutoError("Không tìm thấy bài đăng phù hợp.");
      }
    } catch (err) {
      setAutoError(err.message || "Lỗi khi tự động tìm bài ở ghép.");
    } finally {
      setLoading(false);
      setAutoLoading(false);
    }
  };

  const fetchFilteredPostsByUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        await fetchPosts();
        return;
      }

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
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll lên đầu trang khi đổi trang
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
  if (loading) {
    if (autoLoading) {
      // Giao diện loading kiểu AI với dòng chữ yêu cầu
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-10">
          <Spin size="large" />
          <p className="mt-5 text-lg font-semibold text-gray-700 max-w-md text-center">
            Đang tìm kiếm thông tin phòng phù hợp với thông tin của bạn...
          </p>
        </div>
      );
    }
    return (
      <div className="p-10 text-center text-lg font-medium">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (error || autoError) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        {error || autoError}
      </div>
    );
  }

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
      <div className="mb-6 flex justify-center">
        <Button
          type="primary"
          size="large"
          loading={autoLoading}
          onClick={handleAutoFind}
          style={{
            borderRadius: 30,
            backgroundImage: "linear-gradient(45deg, #FF7E5F, #FEB47B)",
            border: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(255,126,95,0.5)",
            padding: "0 30px",
            transition: "all 0.3s ease",
            fontSize: 18,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,126,95,0.7)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(255,126,95,0.5)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Tự động tìm bạn cùng phòng phù hợp bằng AI
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {currentPosts.map((post) => (
          <Col xs={24} sm={12} md={8} key={post.id}>
            <div
              onClick={() => openDetailModal(post.id)}
              className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              {/* Ảnh bìa */}
              <div className="relative">
                <img
                  src={post.imageBase64List?.[0] || "/default.jpg"}
                  alt="roommate"
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                {/* Avatar người đăng */}
                <Avatar
                  size={50}
                  src={post.ownerAvatar}
                  icon={<UserOutlined />}
                  className="absolute bottom-0 left-4 translate-y-1/2 border-2 border-white shadow "
                />
              </div>

              {/* Nội dung */}
              <div className="p-4">
                {/* Tên người đăng */}
                <h3 className="text-base font-semibold truncate text-gray-800 mt-3">
                  {post.ownerPost}
                </h3>

                {/* Địa chỉ */}
                <p className="text-lg font-semibold text-blue-600 flex items-center gap-1 mt-1">
                  <EnvironmentOutlined
                    style={{ color: "#1890ff", fontSize: 18 }}
                  />{" "}
                  {post.address}
                </p>

                {/* Diện tích */}
                <p className="text-base flex items-center gap-1 mt-2 text-gray-700">
                  <HomeOutlined style={{ color: "#722ed1", fontSize: 16 }} />{" "}
                  <strong>{post.areaSquareMeters} m²</strong>
                </p>

                {/* Giá thuê */}
                <p className="text-base flex items-center gap-1 mt-2 text-gray-700">
                  <DollarOutlined style={{ color: "#fa8c16", fontSize: 16 }} />{" "}
                  <Tag
                    color="green"
                    style={{ fontSize: "14px", padding: "2px 8px" }}
                  >
                    {post.monthlyRentPrice} VND
                  </Tag>
                </p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          pageSize={postsPerPage}
          total={posts.length}
          onChange={handlePageChange}
          showSizeChanger={false} // ẩn chọn số bài trên 1 trang, cố định 9 bài
        />
      </div>
      <Modal
        title="Kết quả tìm kiếm"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        okText="Đóng"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p className="text-lg font-semibold text-center">
          Tỉ lệ trùng khớp thông tin:{" "}
          <span className="text-orange-600">{matchRate}%</span>
        </p>
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        open={openDetail}
        footer={null}
        onCancel={() => setOpenDetail(false)}
        width={1000}
        bodyStyle={{ padding: 0, backgroundColor: "#fafafa" }}
      >
        {selectedPost && (
          <Row gutter={0}>
            {/* Cột trái: Carousel + Thông tin phòng */}
            <Col span={14} style={{ padding: "24px" }}>
              {/* Carousel ảnh */}
              <Carousel autoplay style={{ marginBottom: 16 }}>
                {selectedPost.imageBase64List?.length > 0 ? (
                  selectedPost.imageBase64List.map((img, idx) => (
                    <div key={idx}>
                      <img
                        src={img || "/default.jpg"}
                        alt={`roommate-${idx}`}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <img
                    src="/default.jpg"
                    alt="roommate"
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </Carousel>

              {/* Thông tin bài đăng */}
              <Title level={3} style={{ marginBottom: 8, color: "#fa8c16" }}>
                <HomeOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
                <Text strong>Địa chỉ:</Text> {selectedPost.address}
              </Title>

              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div>
                  <UserOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
                  <Text strong>Người đăng:</Text> {selectedPost.ownerPost}
                </div>
                <div>
                  <ExpandOutlined
                    style={{ marginRight: 8, color: "#1890ff" }}
                  />
                  <Text strong>Diện tích:</Text>{" "}
                  <Tag color="blue">{selectedPost.areaSquareMeters} m²</Tag>
                </div>
                <div>
                  <DollarOutlined
                    style={{ marginRight: 8, color: "#cf1322" }}
                  />
                  <Text strong>Giá thuê:</Text>{" "}
                  <Tag color="volcano">
                    {selectedPost.monthlyRentPrice.toLocaleString()} VND
                  </Tag>
                </div>
                <div>
                  <CalendarOutlined
                    style={{ marginRight: 8, color: "#52c41a" }}
                  />
                  <Text strong>Ngày đăng:</Text> {selectedPost.createdDate}
                </div>
                <div>
                  <Text strong>Mô tả:</Text>
                  <Paragraph style={{ marginTop: 4 }}>
                    {selectedPost.description}
                  </Paragraph>
                </div>
              </Space>
            </Col>

            {/* Cột phải: Avatar + Thông tin người đăng */}
            <Col
              span={10}
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                borderLeft: "1px solid #f0f0f0",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#fa8c16", marginBottom: 8 }}
                />
                <Title level={4} style={{ marginBottom: 0 }}>
                  Phòng đang có
                </Title>
              </div>

              {selectedPost.roommatePreferences?.length > 0 ? (
                selectedPost.roommatePreferences.map((pref, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "16px",
                      background: "#fafafa",
                    }}
                  >
                    <Paragraph>
                      <UserOutlined
                        style={{ marginRight: 8, color: "#fa8c16" }}
                      />
                      <Text strong>Tên:</Text> {pref.name}
                    </Paragraph>
                    <Paragraph>
                      <CalendarOutlined
                        style={{ marginRight: 8, color: "#52c41a" }}
                      />
                      <Text strong>Năm sinh:</Text> {pref.dateOfBirth}
                    </Paragraph>
                    <Paragraph>
                      {pref.gender === "MALE" ? (
                        <ManOutlined
                          style={{ marginRight: 8, color: "#1890ff" }}
                        />
                      ) : (
                        <WomanOutlined
                          style={{ marginRight: 8, color: "#eb2f96" }}
                        />
                      )}
                      <Text strong>Giới tính:</Text>{" "}
                      <Tag
                        color={pref.gender === "MALE" ? "geekblue" : "magenta"}
                      >
                        {pref.gender === "MALE" ? "Nam" : "Nữ"}
                      </Tag>
                    </Paragraph>
                    <Paragraph>
                      <CoffeeOutlined
                        style={{ marginRight: 8, color: "#fa8c16" }}
                      />
                      <Text strong>Biết nấu ăn:</Text>{" "}
                      <Tag color={pref.canCook === "YES" ? "green" : "red"}>
                        {pref.canCook === "YES" ? "Có" : "Không"}
                      </Tag>
                    </Paragraph>
                    <Paragraph>
                      <MoonOutlined
                        style={{ marginRight: 8, color: "#722ed1" }}
                      />
                      <Text strong>Cú đêm:</Text>{" "}
                      <Tag
                        color={pref.isNightOwl === "YES" ? "orange" : "blue"}
                      >
                        {pref.isNightOwl === "YES" ? "Có" : "Không"}
                      </Tag>
                    </Paragraph>
                    <Paragraph>
                      <SmileOutlined
                        style={{ marginRight: 8, color: "#faad14" }}
                      />
                      <Text strong>Nuôi thú cưng:</Text>{" "}
                      <Tag color={pref.hasPet === "YES" ? "green" : "red"}>
                        {pref.hasPet === "YES" ? "Có" : "Không"}
                      </Tag>
                    </Paragraph>
                    <Paragraph>
                      <CloudOutlined
                        style={{ marginRight: 8, color: "#d4380d" }}
                      />
                      <Text strong>Hút thuốc:</Text>{" "}
                      <Tag color={pref.smokes === "YES" ? "red" : "green"}>
                        {pref.smokes === "YES" ? "Có" : "Không"}
                      </Tag>
                    </Paragraph>
                    <Paragraph>
                      <TeamOutlined
                        style={{ marginRight: 8, color: "#13c2c2" }}
                      />
                      <Text strong>Thường rủ bạn về:</Text>{" "}
                      <Tag
                        color={
                          pref.oftenBringsFriendsOver === "YES"
                            ? "orange"
                            : "blue"
                        }
                      >
                        {pref.oftenBringsFriendsOver === "YES" ? "Có" : "Không"}
                      </Tag>
                    </Paragraph>
                  </div>
                ))
              ) : (
                <Text type="secondary">Không có yêu cầu cụ thể</Text>
              )}

              <Button
                type="primary"
                size="large"
                className="bg-orange-500 border-orange-500 mt-4"
                block
                onClick={() => navigate(`/chat/${selectedPost.userId}`)}
              >
                Liên hệ ngay
              </Button>
            </Col>
          </Row>
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
