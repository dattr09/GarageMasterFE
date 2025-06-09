import React, { useState, useEffect } from "react";
import { updatePart } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";

export default function EditPartForm({ part, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: part?.name || "",
    quantity: part?.quantity || "",
    price: part?.price || "",
    buyPrice: part?.buyPrice || "",
    empPrice: part?.empPrice || "",
    unit: part?.unit || "",
    limitStock: part?.limitStock || "",
    brandId: part?.brandId || "",
    image: part?.image || "",
  });
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getAllBrands().then(setBrands);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    });
  };

  // Thêm hàm upload ảnh giống AddPartForm
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "GarageMaster"); // Thay bằng preset của bạn

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/nguyentu11/image/upload", // Thay bằng cloud_name của bạn
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.secure_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.brandId) {
      setError("Vui lòng chọn hãng xe hợp lệ!");
      return;
    }
    if (!form.image) {
      setError("Vui lòng chọn ảnh phụ tùng!");
      return;
    }
    try {
      const data = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        buyPrice: Number(form.buyPrice),
        empPrice: Number(form.empPrice),
        limitStock: Number(form.limitStock),
      };
      await updatePart(part.id, data);
      onSaved();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl border border-blue-100 relative flex flex-col max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          ×
        </button>
        <div className="p-10 pb-0">
          <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
            Sửa phụ tùng
          </h3>
          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}
        </div>
        <div className="overflow-y-auto px-12 pb-10" style={{ maxHeight: "70vh" }}>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <FormInput label="Tên phụ tùng" name="name" value={form.name} onChange={handleChange} required />
            <FormInput label="Số lượng" name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
            <FormInput label="Giá bán" name="price" type="number" value={form.price} onChange={handleChange} required />
            <FormInput label="Giá nhập" name="buyPrice" type="number" value={form.buyPrice} onChange={handleChange} required />
            <FormInput label="Giá nhân viên" name="empPrice" type="number" value={form.empPrice} onChange={handleChange} required />
            <FormInput label="Đơn vị" name="unit" value={form.unit} onChange={handleChange} required />
            <FormInput label="Tồn kho tối thiểu" name="limitStock" type="number" value={form.limitStock} onChange={handleChange} required />
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Hãng xe</label>
              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                required
                className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">-- Chọn hãng xe --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Ảnh phụ tùng</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && <div className="text-blue-500 mt-2 animate-pulse">Đang tải ảnh...</div>}
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  className="w-32 h-32 object-contain rounded-2xl border border-blue-100 shadow mt-3 mx-auto"
                />
              )}
            </div>
            <div className="md:col-span-2 flex gap-6 mt-8 justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide disabled:opacity-60"
                disabled={uploading}
              >
                {uploading ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block font-semibold mb-1 text-gray-700">{label}</label>
      <input
        {...props}
        className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
    </div>
  );
}