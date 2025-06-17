import React, { useState } from "react";
import { updateMoto } from "../../services/MotoApi";
import Swal from "sweetalert2";

export default function EditMotoForm({ moto, brands, customers, onClose, onSaved }) {
  const [form, setForm] = useState({
    licensePlate: moto.licensePlate,
    model: moto.model,
    brandId: moto.brandId,
    customerId: moto.customerId,
    dateOfSent: new Date(moto.dateOfSent).toISOString().split("T")[0],
    notes: moto.notes || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Kiểm tra dữ liệu
      if (!form.model.trim() || !form.brandId || !form.customerId) {
        throw new Error("Vui lòng nhập đầy đủ thông tin!");
      }

      // Gọi API cập nhật
      await updateMoto(moto.licensePlate, {
        ...form,
        brandId: form.brandId,
        customerId: form.customerId,
        dateOfSent: new Date(form.dateOfSent).toISOString()
      });

      // Remove success alert and just call onSaved
      onSaved();
    } catch (err) {
      // Keep error alert for failures
      Swal.fire({
        title: "Lỗi!",
        text: err.message || "Có lỗi xảy ra khi cập nhật",
        icon: "error"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
        >
          ×
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Sửa thông tin xe
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Biển số xe</label>
            <input
              name="licensePlate"
              value={form.licensePlate}
              disabled
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Model</label>
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Hãng xe</label>
            <select
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Chọn hãng xe</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
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
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Chọn chủ xe</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Ngày gửi</label>
            <input
              type="date"
              name="dateOfSent"
              value={form.dateOfSent}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Ghi chú</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="2"
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="md:col-span-2 flex gap-6 mt-8 justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold px-12 py-3 rounded-2xl shadow-xl"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}