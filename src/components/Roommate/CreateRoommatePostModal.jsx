import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import { createRoommatePostApi } from "../../services/Userservices";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function CreateRoommatePostModal({
  open,
  onClose,
  onPostCreated,
}) {
  const [form] = Form.useForm();
  const [imageBase64List, setImageBase64List] = useState([""]);

  // Upload ảnh file + convert sang base64
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newList = [...imageBase64List];
        newList[index] = reader.result;
        setImageBase64List(newList);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setImageBase64List((prev) => [...prev, ""]);
  };

  const removeImageField = (index) => {
    const newList = [...imageBase64List];
    newList.splice(index, 1);
    setImageBase64List(newList);
  };

  const handleCreatePost = async (values) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        message.error("Vui lòng đăng nhập lại");
        return;
      }

      let payloadToken;
      try {
        payloadToken = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() > payloadToken.exp * 1000) {
          message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          return;
        }
      } catch (e) {
        message.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
        return;
      }

      // Format roommatePreferences
      const formattedRoommatePreferences = (
        values.roommatePreferences || []
      ).map((pref) => ({
        name: pref.name,
        dateOfBirth: pref.dateOfBirth
          ? pref.dateOfBirth.format("YYYY-MM-DD")
          : null,
        gender: pref.gender,
        occupation: pref.occupation,
        description: pref.description || "",
        preferredPersonality: pref.preferredPersonality || null,
        canCook: pref.canCook || null,
        isNightOwl: pref.isNightOwl || null,
        hasPet: pref.hasPet || null,
        smokes: pref.smokes || null,
        oftenBringsFriendsOver: pref.oftenBringsFriendsOver || null,
      }));

      const payload = {
        // Trường id thường do backend tạo, bạn không cần gửi
        // "id": ...,

        ownerPost: payloadToken.username || payloadToken.email || "unknown", // tùy token bạn có gì
        address: values.address,
        areaSquareMeters: Number(values.areaSquareMeters),
        monthlyRentPrice: Number(values.monthlyRentPrice),
        description: values.description,
        imageBase64List: imageBase64List.filter((img) => img),
        userId: payloadToken.id, // đây là userId lấy từ token
        roommatePreferences: formattedRoommatePreferences,
        createdDate: dayjs().format("YYYY-MM-DD"), // ngày hiện tại
      };

      await createRoommatePostApi(payload);

      message.success("Đăng bài thành công");
      form.resetFields();
      setImageBase64List([""]);
      onClose();
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Error creating post:", err);
      if (err.response) {
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

        {/* Upload ảnh file với preview */}
        <Form.Item label="Hình ảnh phòng">
          <div className="flex flex-wrap gap-4">
            {imageBase64List.map((base64, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border border-gray-300 rounded overflow-hidden"
              >
                <label
                  htmlFor={`image-upload-${index}`}
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                >
                  {base64 ? (
                    <img
                      src={base64}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">+</span>
                  )}
                </label>
                <input
                  id={`image-upload-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                  className="hidden"
                />
                {imageBase64List.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <div
              onClick={addImageField}
              className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-orange-400 transition"
            >
              <span className="text-gray-400 text-2xl">+</span>
            </div>
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
                    rules={[{ required: true, message: "Chọn ngày sinh" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "gender"]}
                    label="Giới tính"
                    rules={[{ required: true, message: "Chọn giới tính" }]}
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
                    rules={[{ required: true, message: "Chọn nghề nghiệp" }]}
                  >
                    <Select
                      options={[
                        { label: "Sinh viên", value: "STUDENT" },
                        {
                          label: "Nhân viên văn phòng",
                          value: "OFFICE_WORKER",
                        },
                        { label: "Freelancer", value: "FREELANCER" },
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
                        { label: "Có", value: "YES" },
                        { label: "Không", value: "NO" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "isNightOwl"]}
                    label="Thức khuya"
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
