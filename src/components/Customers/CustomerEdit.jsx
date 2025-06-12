import React, { useState } from "react";
import { updateCustomer } from "../../services/CustomerApi";

export default function CustomerEdit({ customer, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Vui lòng nhập đầy đủ tên và email!");
      return;
    }
    try {
      await updateCustomer(customer.id, form);
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
          Sửa khách hàng
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Tên khách hàng</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
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