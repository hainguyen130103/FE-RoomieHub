import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import { createRoommatePostApi } from "../../services/Userservices";

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
      
      // Debug token
      console.log("Token from localStorage:", token);
      
      if (!token) {
        message.error("Vui lòng đăng nhập lại");
        return;
      }

      // Kiểm tra token có hết hạn không
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Token payload:", payload);
        console.log("Token expires at:", new Date(payload.exp * 1000));
        console.log("Current time:", new Date());
        
        if (Date.now() > payload.exp * 1000) {
          message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("accessToken");
          return;
        }
      } catch (e) {
        console.error("Cannot parse token:", e);
        message.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
        return;
      }

      // Test với payload đơn giản giống curl
      const testPayload = {
        address: "test address",
        areaSquareMeters: 50.5,
        monthlyRentPrice: 1000.0,
        description: "test description", 
        imageUrls: ["https://example.com/image.jpg"],
        roommatePreferences: []
      };

      const payload = {
        address: values.address,
        areaSquareMeters: parseFloat(values.areaSquareMeters),
        monthlyRentPrice: parseFloat(values.monthlyRentPrice),
        description: values.description,
        imageUrls: imageUrls,
        roommatePreferences: values.roommatePreferences || [],
      };

      console.log("=== FRONTEND DEBUG ===");
      console.log("Test payload:", JSON.stringify(testPayload, null, 2));
      console.log("Actual payload:", JSON.stringify(payload, null, 2));
      console.log("Payload keys:", Object.keys(payload));
      console.log("roommatePreferences type:", typeof payload.roommatePreferences);
      console.log("roommatePreferences length:", payload.roommatePreferences.length);
      console.log("=== END DEBUG ===");

      // Tạm thời dùng testPayload để debug
      console.log("Using test payload for debugging...");
      await createRoommatePostApi(testPayload);
      message.success("Đăng bài thành công");
      form.resetFields();
      setImageUrls([]);
      onClose();
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Error creating post:", err);
      
      // Xử lý lỗi cụ thể
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        
        if (err.response.status === 401) {
          message.error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
          localStorage.removeItem("accessToken");
        } else if (err.response.status === 403) {
          message.error("Không có quyền thực hiện thao tác này.");
        } else {
          message.error(err.response.data?.message || "Lỗi khi đăng bài");
        }
      } else if (err.message) {
        message.error(err.message);
      } else {
        message.error("Lỗi kết nối. Vui lòng thử lại.");
      }
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
      width={800}
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

        {/* Form.List cho roommatePreferences */}
        <Form.List name="roommatePreferences">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className="border p-4 rounded mb-4 bg-gray-50 relative"
                >
                  <Button
                    type="text"
                    danger
                    onClick={() => remove(name)}
                    style={{ position: "absolute", top: 8, right: 8 }}
                  >
                    Xóa
                  </Button>

                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label="Tên"
                    rules={[{ required: true, message: "Nhập tên" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "dateOfBirth"]}
                    label="Ngày sinh"
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "gender"]}
                    label="Giới tính"
                  >
                    <Select
                      options={[
                        { label: "Nam", value: "MALE" },
                        { label: "Nữ", value: "FEMALE" },
                        { label: "Khác", value: "OTHER" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "occupation"]}
                    label="Nghề nghiệp"
                  >
                    <Select
                      options={[
                        { label: "Sinh viên", value: "STUDENT" },
                        {
                          label: "Nhân viên văn phòng",
                          value: "OFFICE_WORKER",
                        },
                        {
                          label: "Freelancer",
                          value: "FREELANCER",
                        },
                        { label: "Khác", value: "OTHER" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Mô tả"
                  >
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "preferredPersonality"]}
                    label="Tính cách mong muốn"
                  >
                    <Select
                      options={[
                        { label: "Yên tĩnh", value: "QUIET" },
                        { label: "Hòa đồng", value: "SOCIABLE" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "canCook"]}
                    label="Biết nấu ăn"
                  >
                    <Select
                      options={[
                        { label: "Không bao giờ", value: "NEVER" },
                        { label: "Thỉnh thoảng", value: "SOMETIMES" },
                        { label: "Thường xuyên", value: "OFTEN" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "isNightOwl"]}
                    label="Giấc ngủ"
                  >
                    <Select
                      options={[
                        { label: "Ngủ sớm", value: "EARLY_SLEEPER" },
                        { label: "Cú đêm", value: "NIGHT_OWL" },
                        { label: "Linh hoạt", value: "FLEXIBLE" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "hasPet"]}
                    label="Nuôi thú cưng"
                  >
                    <Select
                      options={[
                        { label: "Có", value: "YES" },
                        { label: "Không", value: "NO" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "smokes"]}
                    label="Hút thuốc"
                  >
                    <Select
                      options={[
                        { label: "Có", value: "YES" },
                        { label: "Không", value: "NO" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "oftenBringsFriendsOver"]}
                    label="Thường xuyên mời bạn bè"
                  >
                    <Select
                      options={[
                        { label: "Có", value: "YES" },
                        { label: "Không", value: "NO" },
                      ]}
                    />
                  </Form.Item>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                + Thêm thành viên phòng
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
