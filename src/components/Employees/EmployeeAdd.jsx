import React, { useState } from "react";
import { registerEmployee } from "../../services/EmployeeApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Lock,
  Save,
  XCircle,
  Eye,
  EyeOff,
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

export default function EmployeeAdd({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Xử lý thay đổi giá trị input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý submit form thêm nhân viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      await registerEmployee(form);
      localStorage.setItem("pendingEmail", form.email);
      await Swal.fire({
        icon: "success",
        title: "Tạo tài khoản thành công!",
        text: "Vui lòng kiểm tra email để xác thực tài khoản.",
        confirmButtonText: "Xác nhận",
      });
      navigate(`/confirm-email?email=${encodeURIComponent(form.email)}`);
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
            <User className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Thêm nhân viên mới
            </h3>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Tên nhân viên</label>
              <div className="relative">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Tên nhân viên"
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <User className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Số điện thoại</label>
              <div className="relative">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full"
                />
                <Phone className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Địa chỉ</label>
              <div className="relative">
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Địa chỉ"
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full"
                />
                <MapPin className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Email đăng nhập</label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl w-full"
                />
                <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1 text-gray-700">Mật khẩu</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Mật khẩu"
                  className="pl-10 pr-12 py-2 border-2 border-gray-200 rounded-xl w-full"
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-6 justify-center mt-8">
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
