import React, { useState } from "react";
import { updateBrand } from "../../services/BrandApi";
import { Landmark, Save, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode"; // ✅ đúng cú pháp

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function EditBrandForm({ brand, onClose, onSaved, userRole }) {
  const [name, setName] = useState(brand ? brand.name : "");
  const [image, setImage] = useState(brand ? brand.image || "" : "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Xử lý upload ảnh lên Cloudinary
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

  // Xử lý submit form sửa hãng xe
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

    // 👇 Log token và role
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("🔐 Token:", token);
        console.log(
          "👤 Role:",
          decoded.role || decoded.roles || decoded.authorities || "Không rõ"
        );
      } catch (err) {
        console.error("Lỗi giải mã token:", err);
      }
    } else {
      console.warn("⚠️ Không tìm thấy accessToken trong localStorage");
    }

    try {
      await updateBrand(brand.id, { name, image });
      Swal.fire({
        icon: "success",
        title: "Đã cập nhật!",
        text: "Thông tin hãng xe đã được lưu.",
        confirmButtonColor: "#2563eb",
      });
      onSaved();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

  if (userRole !== "Admin") return null; // Không cho hiển thị nếu không phải admin

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-blue-100 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
            title="Đóng"
            type="button"
          >
            <XCircle className="w-7 h-7" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <Landmark className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Sửa hãng xe
            </h3>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Tên hãng xe
              </label>
              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên hãng xe"
                  required
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <Landmark className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Ảnh hãng xe
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && (
                <div className="text-blue-500 mt-2 animate-pulse text-center">
                  Đang tải ảnh lên...
                </div>
              )}
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="w-32 h-32 object-contain rounded-2xl border border-blue-100 shadow mt-3 mx-auto"
                />
              )}
            </div>

            <div className="md:col-span-2 flex gap-6 mt-8 justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2 disabled:opacity-60"
                disabled={uploading}
              >
                <Save className="w-5 h-5" />
                {uploading ? "Đang lưu..." : "Lưu"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
