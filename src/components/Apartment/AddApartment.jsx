import React, { useState, useEffect } from "react";
import {
  createApartmentApi,
  getMyPackagesApi,
} from "../../services/Userservices";
import { message, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

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
    imageBase64s: [""],
  });

  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getMyPackagesApi();
        if (res?.data?.length > 0) {
          setPackages(res.data);
          setSelectedPackageId(res.data[0].packageId); // mặc định chọn gói đầu tiên
        } else {
          Modal.error({
            title: "Chưa có gói đăng bài hợp lệ",
            content: "Vui lòng đăng ký gói đăng bài để tiếp tục.",
            okText: "Đăng ký ngay",
            onOk: () => navigate("/packages"),
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy gói đăng bài:", error);
        message.error(error.message || "Không thể lấy thông tin gói đăng bài");
      }
    };

    fetchPackages();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (value) => {
    setSelectedPackageId(value);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newList = [...form.imageBase64s];
        newList[index] = reader.result;
        setForm((prev) => ({ ...prev, imageBase64s: newList }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setForm((prev) => ({
      ...prev,
      imageBase64s: [...prev.imageBase64s, ""],
    }));
  };

  const removeImageField = (index) => {
    const newList = [...form.imageBase64s];
    newList.splice(index, 1);
    setForm((prev) => ({ ...prev, imageBase64s: newList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPackageId) {
      message.error("Vui lòng chọn gói đăng bài hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        title: form.title,
        description: form.description,
        address: form.address,
        price: parseFloat(form.price),
        area: parseFloat(form.area),
        genderRequirement: form.genderRequirement,
        deposit: form.deposit,
        legalDocuments: form.legalDocuments,
        utilities: form.utilities,
        furniture: form.furniture,
        interiorCondition: form.interiorCondition,
        elevator: form.elevator,
        contact: form.contact,
        location: form.location,
        packageId: Number(selectedPackageId),
        imageBase64s: form.imageBase64s,
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
          imageBase64s: [""],
        });
        if (packages.length > 0) {
          setSelectedPackageId(packages[0].packageId);
        }
      } else {
        message.error("Đăng tin thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow border mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Đăng tin cho thuê căn hộ
      </h1>

      {/* Dropdown chọn gói */}
      <div className="mb-6">
        <label
          htmlFor="package-select"
          className="block mb-2 font-semibold text-gray-700"
        >
          Chọn gói đăng bài:
        </label>
        <Select
          id="package-select"
          style={{ width: "100%" }}
          placeholder="Chọn gói đăng bài"
          value={selectedPackageId}
          onChange={handlePackageChange}
          disabled={packages.length === 0}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {packages.map((pkg) => (
            <Option key={pkg.packageId} value={pkg.packageId}>
              {`${pkg.packageName} - còn ${pkg.remainingPosts} bài đăng - hết hạn: ${pkg.expiredAt}`}
            </Option>
          ))}
        </Select>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Phần form còn lại giữ nguyên như cũ */}
        {/* ... (giữ nguyên code phần input, textarea, hình ảnh như trước) */}

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
                required
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Giá (VND)"
                type="number"
                className="p-3 border rounded"
                min={0}
                step="0.01"
                required
              />
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Diện tích (m²)"
                type="number"
                className="p-3 border rounded"
                min={0}
                step="0.01"
                required
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
                required
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
                required
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
              required
            />
          </fieldset>

          {/* Hình ảnh */}
          <fieldset className="border border-gray-300 rounded p-4">
            <legend className="text-lg font-semibold">Hình ảnh căn hộ</legend>
            <div className="flex flex-wrap gap-4 mt-4">
              {form.imageBase64s.map((base64, index) => (
                <div key={index} className="relative w-24 h-24">
                  <label
                    htmlFor={`image-${index}`}
                    className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer overflow-hidden hover:border-orange-400 transition"
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
                    id={`image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="hidden"
                  />
                  {form.imageBase64s.length > 1 && (
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
          </fieldset>

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
