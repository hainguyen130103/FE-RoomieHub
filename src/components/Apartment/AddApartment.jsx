import React, { useState } from "react";
import { createApartmentApi } from "../../services/Userservices";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";

const PostApartment = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    area: "",
    genderRequirement: "",
    deposit: "",
    legalDocuments: "",
    utilities: "",
    furniture: "",
    interiorCondition: "",
    elevator: "",
    contact: "",
    location: "",
    imageUrls: [""],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, index) => {
    const newImageUrls = [...form.imageUrls];
    newImageUrls[index] = e.target.value;
    setForm((prev) => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const removeImageField = (index) => {
    const newImageUrls = [...form.imageUrls];
    newImageUrls.splice(index, 1);
    setForm((prev) => ({ ...prev, imageUrls: newImageUrls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        ...form,
        price: parseFloat(form.price),
        area: parseFloat(form.area),
      };
      const res = await createApartmentApi(payload, token);

      if (res.status === 201 || res.status === 200) {
        message.success("Đăng tin thành công!");
        setForm({
          title: "",
          description: "",
          address: "",
          price: "",
          area: "",
          genderRequirement: "",
          deposit: "",
          legalDocuments: "",
          utilities: "",
          furniture: "",
          interiorCondition: "",
          elevator: "",
          contact: "",
          location: "",
          imageUrls: [""],
        });
      } else {
        message.error("Đăng tin thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data?.code === "NO_ACTIVE_PACKAGE"
      ) {
        Modal.error({
          title: "Chưa có gói đăng bài hợp lệ",
          content:
            err.response.data?.message ||
            "Vui lòng đăng ký gói đăng bài để tiếp tục.",
          okText: "Đăng ký ngay",
          onOk: () => navigate("/packages"),
        });
      } else {
        message.error("Lỗi khi gửi dữ liệu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow border mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Đăng tin cho thuê căn hộ
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Cột trái */}
        <div className="space-y-8">
          {/* Thông tin phòng */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-lg font-semibold">Thông tin phòng</legend>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Tiêu đề"
                className="p-3 border rounded"
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Giá (VND)"
                type="number"
                className="p-3 border rounded"
              />
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Diện tích (m²)"
                type="number"
                className="p-3 border rounded"
              />
              <input
                name="genderRequirement"
                value={form.genderRequirement}
                onChange={handleChange}
                placeholder="Yêu cầu giới tính"
                className="p-3 border rounded"
              />
              <input
                name="deposit"
                value={form.deposit}
                onChange={handleChange}
                placeholder="Tiền cọc"
                className="p-3 border rounded"
              />
            </div>
          </fieldset>

          {/* Vị trí phòng */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-lg font-semibold">Vị trí phòng</legend>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Địa chỉ"
                className="p-3 border rounded"
              />
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Khu vực (ví dụ: HCM, Hà Nội...)"
                className="p-3 border rounded"
              />
            </div>
          </fieldset>

          {/* Thông tin chi tiết */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-lg font-semibold">
              Thông tin chi tiết
            </legend>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <input
                name="legalDocuments"
                value={form.legalDocuments}
                onChange={handleChange}
                placeholder="Pháp lý"
                className="p-3 border rounded"
              />
              <input
                name="utilities"
                value={form.utilities}
                onChange={handleChange}
                placeholder="Tiện ích đi kèm"
                className="p-3 border rounded"
              />
              <input
                name="furniture"
                value={form.furniture}
                onChange={handleChange}
                placeholder="Nội thất"
                className="p-3 border rounded"
              />
              <input
                name="interiorCondition"
                value={form.interiorCondition}
                onChange={handleChange}
                placeholder="Tình trạng nội thất"
                className="p-3 border rounded"
              />
              <input
                name="elevator"
                value={form.elevator}
                onChange={handleChange}
                placeholder="Thang máy"
                className="p-3 border rounded"
              />
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Thông tin liên hệ (sđt, Zalo...)"
                className="p-3 border rounded"
              />
            </div>
          </fieldset>
        </div>

        {/* Cột phải */}
        <div className="space-y-8">
          {/* Mô tả */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-lg font-semibold">Mô tả chi tiết</legend>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết căn hộ"
              rows={8}
              className="w-full p-3 border rounded mt-4"
            />
          </fieldset>

          {/* Hình ảnh */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-lg font-semibold">Hình ảnh căn hộ</legend>
            <div className="space-y-2 mt-4">
              {form.imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleImageChange(e, index)}
                    placeholder={`Ảnh ${index + 1}`}
                    className="flex-1 p-2 border rounded"
                  />
                  {form.imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="text-red-500 font-bold"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-blue-600 hover:underline text-sm"
              >
                + Thêm ảnh
              </button>
            </div>
          </fieldset>

          {/* Nút gửi */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-10 w-full py-3 text-white font-semibold rounded ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {loading ? "Đang đăng..." : "Đăng tin ngay"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostApartment;
