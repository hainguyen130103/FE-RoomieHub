import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import {
  createRoommatePostApi,
  getUserProfileApi,
} from "../../services/Userservices";

const { TextArea } = Input;

export default function CreateRoommatePostModal({
  open,
  onClose,
  onPostCreated,
}) {
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);

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

      await createRoommatePostApi(payload, token); // ✅ truyền token vào
      message.success("Đăng bài thành công");
      form.resetFields();
      setImageUrls([]);
      onClose();
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Error creating post:", err);
      message.error("Lỗi khi đăng bài");
    }
  };

  return (
    <Modal
      open={open}
      title="Đăng bài tìm bạn ở ghép"
      onCancel={onClose}
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
  );
}
