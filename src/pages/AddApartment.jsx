import React, { useState } from "react";
import { createApartmentApi } from "../services/Userservices";

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
    images: [],
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((file) => formData.append("images", file));
        } else {
          formData.append(key, value);
        }
      });

      const response = await createApartmentApi(formData, token);

      if (response.status === 201 || response.status === 200) {
        setMessage("✅ Đăng tin thành công!");
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
          images: [],
          location: "",
        });
      } else {
        setMessage("❌ Đăng tin thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Lỗi kết nối hoặc dữ liệu không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white shadow-lg rounded-xl border">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        Đăng Tin Cho Thuê Căn Hộ
      </h2>
      {message && (
        <div
          className={`text-center mb-6 font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tiêu đề"
          className="p-3 border rounded-lg"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Địa chỉ"
          className="p-3 border rounded-lg"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Giá (triệu VND)"
          className="p-3 border rounded-lg"
        />
        <input
          name="area"
          type="number"
          value={form.area}
          onChange={handleChange}
          placeholder="Diện tích (m²)"
          className="p-3 border rounded-lg"
        />
        <input
          name="genderRequirement"
          value={form.genderRequirement}
          onChange={handleChange}
          placeholder="Yêu cầu giới tính"
          className="p-3 border rounded-lg"
        />
        <input
          name="deposit"
          value={form.deposit}
          onChange={handleChange}
          placeholder="Tiền cọc"
          className="p-3 border rounded-lg"
        />
        <input
          name="legalDocuments"
          value={form.legalDocuments}
          onChange={handleChange}
          placeholder="Pháp lý"
          className="p-3 border rounded-lg"
        />
        <input
          name="utilities"
          value={form.utilities}
          onChange={handleChange}
          placeholder="Tiện ích"
          className="p-3 border rounded-lg"
        />
        <input
          name="furniture"
          value={form.furniture}
          onChange={handleChange}
          placeholder="Nội thất"
          className="p-3 border rounded-lg"
        />
        <input
          name="interiorCondition"
          value={form.interiorCondition}
          onChange={handleChange}
          placeholder="Tình trạng nội thất"
          className="p-3 border rounded-lg"
        />
        <input
          name="elevator"
          value={form.elevator}
          onChange={handleChange}
          placeholder="Thang máy"
          className="p-3 border rounded-lg"
        />
        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Thông tin liên hệ"
          className="p-3 border rounded-lg"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Khu vực"
          className="p-3 border rounded-lg"
        />

        <div className="col-span-1 md:col-span-2">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Mô tả chi tiết"
            className="w-full p-3 border rounded-lg h-32"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block font-semibold mb-2">
            Hình ảnh (chọn nhiều ảnh):
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className={`w-full py-3 text-lg font-semibold rounded-lg text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Đang đăng..." : "Đăng tin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostApartment;
