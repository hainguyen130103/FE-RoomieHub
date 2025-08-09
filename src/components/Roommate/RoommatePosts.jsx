import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Upload,
  message,
  Form,
  Typography,
  Row,
  Col,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  createRoommatePostApi,
  filterRoommatePostsApi,
  getAllRoommatePostsApi,
  getRoommatePostByIdApi,
  getUserProfileApi,
} from "../../services/Userservices";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function RoommatePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
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
        gender: profile.gender || undefined, // MALE, FEMALE, ANY
        occupation: profile.occupation || undefined, // STUDENT, OFFICE_WORKER, FREELANCER, OTHER
        // personality: profile.preferredPersonality || undefined, // nếu API có
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
        hasPet: profile.pets || undefined, // YES, NO
        smokes: profile.smoking || undefined, // YES, NO
        bringsFriends: profile.inviteFriends || undefined, // YES, NO
      };

      console.log("Payload filter:", payload);
      await fetchPosts(payload);
    } catch (err) {
      message.error("Không thể lọc theo hồ sơ cá nhân");
    }
  };

  useEffect(() => {
    fetchFilteredPostsByUserProfile();
  }, []);

  const handleCreatePost = async (values) => {
    try {
      const token = localStorage.getItem("accessToken");
      const decoded = jwtDecode(token);
      const profile = await getUserProfileApi(decoded.id);

      const roommatePreference = {
        name: profile.userName || "",
        dateOfBirth: profile.birthYear
          ? dayjs(`${profile.birthYear}-01-01`).format("YYYY-MM-DD")
          : null,
        gender: profile.gender || "ANY",
        occupation: profile.occupation || "OTHER",
        description: profile.description || "",
        preferredPersonality: profile.preferredPersonality || "QUIET",
        canCook:
          profile.cookFrequency === "OFTEN"
            ? "YES"
            : profile.cookFrequency === "NEVER"
              ? "NO"
              : "NO",
        isNightOwl:
          profile.sleepHabit === "NIGHT_OWL"
            ? "YES"
            : profile.sleepHabit === "EARLY_SLEEPER"
              ? "NO"
              : "NO",
        hasPet: profile.pets || "NO",
        smokes: profile.smoking || "NO",
        oftenBringsFriendsOver: profile.inviteFriends || "NO",
      };

      const payload = {
        address: values.address,
        areaSquareMeters: parseFloat(values.areaSquareMeters),
        monthlyRentPrice: parseFloat(values.monthlyRentPrice),
        description: values.description,
        imageUrls: imageUrls,
        roommatePreferences: [roommatePreference],
      };

      await createRoommatePostApi(payload); // Không truyền token nữa
      message.success("Đăng bài thành công");
      setOpenModal(false);
      form.resetFields();
      setImageUrls([]);
      fetchFilteredPostsByUserProfile();
    } catch (err) {
      console.error("Error creating post:", err);
      message.error("Lỗi khi đăng bài");
    }
  };

  const openDetailModal = async (postId) => {
    try {
      const res = await getRoommatePostByIdApi(postId);
      setSelectedPost(res.data);
      setOpenDetail(true);
    } catch (err) {
      message.error("Không thể tải chi tiết bài đăng");
    }
  };

  const handleOpenCreateModal = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const decoded = jwtDecode(token);
      const profile = await getUserProfileApi(decoded.id);
      setUserProfile(profile);
      setOpenModal(true);
    } catch (err) {
      message.error("Không thể lấy thông tin người dùng");
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
          onClick={handleOpenCreateModal}
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

      <Modal
        open={openModal}
        title="Đăng bài tìm bạn ở ghép"
        onCancel={() => setOpenModal(false)}
        onOk={() => form.submit()}
        okText="Đăng bài"
        cancelText="Hủy"
        okButtonProps={{ className: "bg-orange-500 border-orange-500" }}
      >
        <Form layout="vertical" form={form} onFinish={handleCreatePost}>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Diện tích (m²)"
            name="areaSquareMeters"
            rules={[{ required: true, message: "Vui lòng nhập diện tích" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Giá thuê mỗi tháng"
            name="monthlyRentPrice"
            rules={[{ required: true, message: "Vui lòng nhập giá thuê" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Link ảnh (URL)">
            <Input
              placeholder="Nhập URL ảnh và nhấn Enter"
              onPressEnter={(e) => {
                const url = e.target.value.trim();
                if (url) {
                  setImageUrls((prev) => [...prev, url]);
                  e.target.value = "";
                }
              }}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>

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
            {/* Thông tin người đăng */}
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
    </div>
  );
}
