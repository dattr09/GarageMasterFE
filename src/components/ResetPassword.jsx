import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [current, setCurrent] = useState(""); // Mật khẩu hiện tại (random gửi về email)
  const [password, setPassword] = useState(""); // Mật khẩu mới
  const [confirm, setConfirm] = useState(""); // Xác nhận mật khẩu mới
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("resetEmail") || "");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email) {
      setMessage("Không tìm thấy email để đổi mật khẩu.");
      return;
    }
    if (!current) {
      setMessage("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    if (!password) {
      setMessage("Vui lòng nhập mật khẩu mới.");
      return;
    }
    if (password !== confirm) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);

    // Thêm dòng này để kiểm tra giá trị gửi lên
    console.log({ email, current, password });

    try {
      const res = await fetch("http://localhost:5119/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword: current, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Đổi mật khẩu thành công!");
        setTimeout(() => {
          localStorage.removeItem("resetEmail");
          navigate("/login");
        }, 1200);
      } else {
        setMessage(data.message || "Đổi mật khẩu thất bại.");
      }
    } catch (err) {
      setMessage("Không thể kết nối máy chủ!");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      {/* Thông báo */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl px-6 py-4 shadow-2xl text-base font-semibold
          ${message.includes("thành công")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"}
        `}
          role="alert"
        >
          {message.includes("thành công") ? (
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#bbf7d0" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fef2f2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
            </svg>
          )}
          <span className="whitespace-pre-line">{message}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md px-8 py-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-md"
      >
        <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow">
          Đổi mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm border-gray-300 focus:border-blue-400 placeholder-gray-400"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                onClick={() => setShowCurrent((v) => !v)}
                tabIndex={0}
                role="button"
                aria-label={showCurrent ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                style={{ padding: 0 }}
              >
                {showCurrent ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm border-gray-300 focus:border-blue-400 placeholder-gray-400"
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
          <div>
            <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm border-gray-300 focus:border-blue-400 placeholder-gray-400"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={0}
                role="button"
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                style={{ padding: 0 }}
              >
                {showConfirm ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60 text-lg tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Đang đổi mật khẩu...
              </>
            ) : (
              "Đổi mật khẩu"
            )}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-700 hover:underline font-semibold cursor-pointer text-base"
            type="button"
          >
            Quay lại đăng nhập
          </button>
        </div>
        {/* Xóa hoặc comment lại motion.p cũ để tránh trùng lặp */}
      </motion.div>
    </div>
  );
}