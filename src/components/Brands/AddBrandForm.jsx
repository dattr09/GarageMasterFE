import React, { useState } from "react";
import { createBrand } from "../../services/BrandApi";

export default function AddBrandForm({ onClose, onSaved }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  // Xử lý chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Thêm hãng xe
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Tên hãng xe</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tên hãng xe"
              required
              className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {image && (
              <img src={image} alt="Preview" className="h-16 mt-2 mx-auto object-contain" />
            )}
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-8 py-2 rounded-xl shadow-lg transition text-lg"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-600 text-white font-semibold px-8 py-2 rounded-xl shadow-lg transition text-lg"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}