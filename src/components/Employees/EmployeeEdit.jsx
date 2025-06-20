import React, { useState } from "react";
import { updateEmployee } from "../../services/EmployeeApi";

export default function EmployeeEdit({ employee, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: employee.name,
    phone: employee.phone,
    address: employee.address,
    employeeRole: employee.employeeRole,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Gửi đủ các trường backend yêu cầu
      const updateData = {
        id: employee.id, // hoặc _id nếu backend dùng _id
        userId: employee.userId,
        name: form.name,
        phone: form.phone,
        address: form.address,
        employeeRole: employee.employeeRole,
        dateJoined: employee.dateJoined,
      };
      await updateEmployee(employee.id, updateData);
      onSaved && onSaved();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          ×
        </button>
        <h3 className="text-2xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Sửa thông tin nhân viên
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Tên nhân viên</label>
            <input name="name" value={form.name} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full" required />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Số điện thoại</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full" required />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Địa chỉ</label>
            <input name="address" value={form.address} onChange={handleChange} className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full" required />
          </div>
          <div className="flex gap-6 justify-center mt-8">
            <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide">
              Lưu
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}