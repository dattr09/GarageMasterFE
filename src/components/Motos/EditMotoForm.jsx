import React, { useState } from "react";
import { updateMoto } from "../../services/MotoApi";
import Swal from "sweetalert2";
import {
  Save,
  XCircle,
  Bike,
  Landmark,
  Calendar,
  StickyNote
} from "lucide-react";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function EditMotoForm({ moto, brands, customers, onClose, onSaved }) {
  const [form, setForm] = useState({
    licensePlate: moto.licensePlate,
    model: moto.model,
    brandId: moto.brandId,
    customerId: moto.customerId,
    dateOfSent: new Date(moto.dateOfSent).toISOString().split("T")[0],
    notes: moto.notes || ""
  });

  // Xử lý thay đổi input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý submit form cập nhật xe máy
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.model.trim() || !form.brandId || !form.customerId) {
        throw new Error("Vui lòng nhập đầy đủ thông tin!");
      }

      await updateMoto(moto.licensePlate, {
        ...form,
        dateOfSent: new Date(form.dateOfSent).toISOString()
      });

      Swal.fire({
        icon: "success",
        title: "Đã cập nhật!",
        text: "Thông tin xe máy đã được lưu.",
        confirmButtonColor: "#2563eb",
      });

      onSaved();
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text: err.message || "Có lỗi xảy ra khi cập nhật",
        icon: "error"
      });
    }
  };

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl border border-blue-100 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            title="Đóng"
            type="button"
          >
            <XCircle className="w-7 h-7" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <Bike className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Sửa thông tin xe
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Biển số xe</label>
              <div className="relative">
                <input
                  name="licensePlate"
                  value={form.licensePlate}
                  disabled
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 bg-gray-100 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Bike className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Tên xe</label>
              <div className="relative">
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên xe"
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Landmark className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Hãng xe</label>
              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                required
                className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Chọn hãng xe</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Chủ xe</label>
              <select
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                required
                className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Chọn chủ xe</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Ngày gửi</label>
              <div className="relative">
                <input
                  type="date"
                  name="dateOfSent"
                  value={form.dateOfSent}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Calendar className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Ghi chú</label>
              <div className="relative">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Ghi chú thêm..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <StickyNote className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="md:col-span-2 flex gap-6 mt-8 justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
              >
                <Save className="w-5 h-5" /> Lưu
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" /> Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
