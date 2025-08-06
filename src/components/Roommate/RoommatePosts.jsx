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
        address: profile.location || undefined,
        minArea: profile.area || undefined,
        maxPrice: profile.price || undefined,
        dob: profile.birthYear
          ? dayjs().year(profile.birthYear).format("YYYY-MM-DD")
          : undefined,
        gender: profile.gender || undefined,
        occupation: profile.occupation || undefined,
        personality: profile.preferredPersonality || undefined,
        canCook: profile.cookFrequency === "OFTEN" ? "YES" : "NO",
        isNightOwl: profile.sleepHabit === "NIGHT_OWL" ? "YES" : "NO",
        hasPet: profile.pets || undefined,
        smokes: profile.smoking || undefined,
        bringsFriends: profile.inviteFriends || undefined,
      };

      console.log("Payload gửi đi:", payload);
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
      const roommatePreference = {
        name: userProfile.userName,
        dateOfBirth: dayjs().year(userProfile.birthYear).format("YYYY-MM-DD"),
        gender: userProfile.gender,
        occupation: userProfile.occupation,
        description: "Tìm bạn ở ghép phù hợp",
        preferredPersonality: userProfile.preferredPersonality,
        canCook: userProfile.cookFrequency === "OFTEN" ? "YES" : "NO",
        isNightOwl: userProfile.sleepHabit === "LATE_SLEEPER" ? "YES" : "NO",
        hasPet: userProfile.pets,
        smokes: userProfile.smoking,
        oftenBringsFriendsOver: userProfile.inviteFriends,
      };

      await createRoommatePostApi(
        {
          ...values,
          imageUrls,
          roommatePreferences: [roommatePreference],
        },
        token
      );
      message.success("Đăng bài thành công");
      setOpenModal(false);
      form.resetFields();
      setImageUrls([]);
      fetchFilteredPostsByUserProfile();
    } catch (err) {
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
            label="Tên người đăng"
            name="ownerPost"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Diện tích (m²)"
            name="areaSquareMeters"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Giá thuê mỗi tháng"
            name="monthlyRentPrice"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Ảnh minh họa">
            <Upload
              listType="picture"
              maxCount={3}
              beforeUpload={(file) => {
                const url = URL.createObjectURL(file);
                setImageUrls((prev) => [...prev, url]);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
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
          </div>
        )}
      </Modal>
    </div>
  );
}
