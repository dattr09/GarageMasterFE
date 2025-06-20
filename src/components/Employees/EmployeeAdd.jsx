import React, { useState } from "react";
import { registerEmployee } from "../../services/EmployeeApi";
import { useNavigate } from "react-router-dom"; // Thêm dòng này
import Swal from "sweetalert2";

export default function EmployeeAdd({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Thêm state này
  const navigate = useNavigate(); // Thêm dòng này

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      await registerEmployee({
        name: form.name,
        phone: form.phone,
        address: form.address,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("pendingEmail", form.email);
      await Swal.fire({
        icon: "success",
        title: "Tạo tài khoản thành công!",
        text: "Vui lòng kiểm tra email để xác thực tài khoản.",
        confirmButtonText: "Xác nhận",
      });
      navigate(`/confirm-email?email=${encodeURIComponent(form.email)}`);
      // Không gọi onSaved ở đây!
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
          Thêm nhân viên mới
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Tên nhân viên
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Địa chỉ
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Email đăng nhập
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full pr-12"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                style={{ padding: 0 }}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
          </div>
          <div className="flex gap-6 justify-center mt-8">
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