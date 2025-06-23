import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  PackagePlus,
  Tags,
  Hash,
  DollarSign,
  Warehouse,
  PackageCheck,
  Save,
  XCircle,
  Boxes,
  Layers,
} from "lucide-react";
import { createPart } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95);}
  100% { opacity: 1; transform: scale(1);}
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function AddPartForm({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    buyPrice: "",
    empPrice: "",
    unit: "",
    limitStock: "",
    brandId: "",
    image: "",
  });

  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Lấy danh sách hãng xe khi load component
  useEffect(() => {
    getAllBrands().then(setBrands);
  }, []);

  // Xử lý thay đổi input form
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    });
  };

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
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.secure_url }));
    setUploading(false);
  };

  // Xử lý submit form thêm phụ tùng mới
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
      await createPart(data);

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Phụ tùng đã được thêm.",
        confirmButtonColor: "#2563eb",
      });

      onSaved();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

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
            <PackagePlus className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Thêm phụ tùng mới
            </h3>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            <FormInput icon={<Tags />} label="Tên phụ tùng" name="name" value={form.name} onChange={handleChange} required />
            <FormInput icon={<Boxes />} label="Số lượng" name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
            <FormInput icon={<DollarSign />} label="Giá bán" name="price" type="number" value={form.price} onChange={handleChange} required />
            <FormInput icon={<Warehouse />} label="Giá nhập" name="buyPrice" type="number" value={form.buyPrice} onChange={handleChange} required />
            <FormInput icon={<PackageCheck />} label="Giá nhân viên" name="empPrice" type="number" value={form.empPrice} onChange={handleChange} required />
            <FormInput icon={<Layers />} label="Đơn vị" name="unit" value={form.unit} onChange={handleChange} required />
            <FormInput icon={<Hash />} label="Tồn kho tối thiểu" name="limitStock" type="number" value={form.limitStock} onChange={handleChange} required />

            <div className="relative">
              <label className="block font-semibold mb-1 text-gray-700">Hãng xe</label>
              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                required
                className="pl-4 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              {uploading && (
                <div className="text-blue-500 mt-2 text-sm animate-pulse text-center">
                  Đang tải ảnh lên...
                </div>
              )}
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  className="w-32 h-32 object-contain rounded-2xl border border-blue-100 shadow mt-3 mx-auto"
                />
              )}
            </div>

            <div className="col-span-1 sm:col-span-2 md:col-span-3 flex gap-6 mt-8 justify-center">
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2 disabled:opacity-60"
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

// Input dùng chung cho form
function FormInput({ label, icon, ...props }) {
  return (
    <div className="relative">
      <label className="block font-semibold mb-1 text-gray-700">{label}</label>
      <input
        {...props}
        className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      {icon && <span className="absolute left-3 top-10 text-gray-400">{icon}</span>}
    </div>
  );
}
