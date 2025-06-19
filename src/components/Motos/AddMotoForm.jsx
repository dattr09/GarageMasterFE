import React, { useState } from "react";
import { createMoto } from "../../services/MotoApi";

export default function AddMotoForm({ brands, customers, onClose, onSaved }) {
  const [form, setForm] = useState({
    licensePlate: "",
    model: "",
    brandId: "",
    customerId: "",
    dateOfSent: new Date().toISOString().split("T")[0],
    notes: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.licensePlate.trim() || !form.model.trim() || !form.brandId || !form.customerId) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      // Chuyển đổi tên trường sang PascalCase nếu backend yêu cầu
      await createMoto({
        LicensePlate: form.licensePlate,
        Model: form.model,
        BrandId: form.brandId,
        CustomerId: form.customerId,
        DateOfSent: form.dateOfSent,
        Notes: form.notes
      });
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
        >
          ×
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Thêm xe mới
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Biển số xe</label>
            <input
              name="licensePlate"
              value={form.licensePlate}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Tên xe</label>
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Hãng xe</label>
            <select
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Ghi chú</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="2"
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="md:col-span-2 flex gap-6 mt-8 justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide"
            >
              Lưu
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