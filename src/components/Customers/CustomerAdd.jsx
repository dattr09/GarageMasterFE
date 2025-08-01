import React, { useState } from "react";
import Swal from "sweetalert2";
import { UserPlus, Mail, Phone, MapPin, Save, XCircle } from "lucide-react";

// Gọi API tạo khách hàng mới
const createCustomer = async (customerData) => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8080/api/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(customerData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Thêm khách hàng thất bại!");
  }

  return await res.json();
};

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95);}
  100% { opacity: 1; transform: scale(1);}
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function CustomerAdd({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  // Xử lý thay đổi giá trị input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý submit form thêm khách hàng
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Vui lòng nhập đầy đủ tên và email!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.Id || user?.id;
    if (!userId) {
      setError("Không tìm thấy userId. Vui lòng đăng nhập lại!");
      return;
    }

    try {
      await createCustomer({
        userId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Khách hàng đã được thêm.",
        confirmButtonColor: "#2563eb",
      });

      onSaved();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

  return (
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
          <UserPlus className="text-blue-700 w-8 h-8" />
          <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
            Thêm khách hàng
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
          <div className="relative">
            <label className="block font-semibold mb-1 text-gray-700">
              Tên khách hàng
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <UserPlus className="absolute left-3 top-10 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1 text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <Mail className="absolute left-3 top-10 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1 text-gray-700">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <Phone className="absolute left-3 top-10 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1 text-gray-700">
              Địa chỉ
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <MapPin className="absolute left-3 top-10 text-gray-400 w-5 h-5" />
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
  );
}
