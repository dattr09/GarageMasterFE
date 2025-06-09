import React, { useState } from "react";
import { createBrand } from "../../services/BrandApi";

export default function AddBrandForm({ onClose, onSaved }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "GarageMaster");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/nguyentu11/image/upload",
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setImage(data.secure_url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tên hãng xe không được để trống");
      return;
    }
    if (!image) {
      setError("Vui lòng chọn ảnh hãng xe");
      return;
    }
    try {
      await createBrand({ name, image });
      onSaved();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          ×
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Thêm hãng xe
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Tên hãng xe</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tên hãng xe"
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Ảnh hãng xe</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <div className="text-blue-500 mt-2 animate-pulse">Đang tải ảnh...</div>}
            {image && (
              <img src={image} alt="Preview" className="w-32 h-32 object-contain rounded-2xl border border-blue-100 shadow mt-3 mx-auto" />
            )}
          </div>
          <div className="md:col-span-2 flex gap-6 mt-8 justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide"
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
  );
}