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

      const payload = {
        address: values.address,
        areaSquareMeters: parseFloat(values.areaSquareMeters),
        monthlyRentPrice: parseFloat(values.monthlyRentPrice),
        description: values.description,
        imageUrls: imageUrls,
        roommatePreferences: values.roommatePreferences || [],
      };

      await createRoommatePostApi(payload, token);
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
