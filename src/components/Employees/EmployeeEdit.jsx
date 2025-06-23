import React, { useState } from "react";
import { updateEmployee } from "../../services/EmployeeApi";
import { Landmark, Save, XCircle, Phone, MapPin } from "lucide-react";
import Swal from "sweetalert2";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function EmployeeEdit({ employee, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: employee.name,
    phone: employee.phone,
    address: employee.address,
    employeeRole: employee.employeeRole,
  });
  const [error, setError] = useState("");

  // Xử lý thay đổi giá trị input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý submit form sửa thông tin nhân viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const updateData = {
        id: employee.id,
        userId: employee.userId,
        name: form.name,
        phone: form.phone,
        address: form.address,
        employeeRole: employee.employeeRole,
        dateJoined: employee.dateJoined,
      };
      await updateEmployee(employee.id, updateData);
      await Swal.fire({
        icon: "success",
        title: "Đã cập nhật!",
        text: "Thông tin nhân viên đã được lưu.",
        confirmButtonColor: "#2563eb",
      });
      onSaved && onSaved();
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
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            title="Đóng"
            type="button"
          >
            <XCircle className="w-7 h-7" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <Landmark className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Sửa thông tin nhân viên
            </h3>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Tên nhân viên
              </label>
              <div className="relative">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
                <Landmark className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Số điện thoại
              </label>
              <div className="relative">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
                <Phone className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-gray-700">
                Địa chỉ
              </label>
              <div className="relative">
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
                <MapPin className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="md:col-span-2 flex gap-6 mt-8 justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Lưu
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
