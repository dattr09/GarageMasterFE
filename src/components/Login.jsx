import React, { useState } from "react";
import { login } from "../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const data = await login({ email, password });
      setMessage(data.message || "Đăng nhập thành công.");
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error) {
      setMessage(error.message || "Đăng nhập thất bại.");
      setToken(null);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full px-8 py-4"
    >
      <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow">
        Đăng nhập
      </h2>
      <form onSubmit={handleLogin} className="space-y-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField("")}
              autoComplete="username"
              placeholder="Nhập email của bạn"
              className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                ${focusField === "email"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300 focus:border-blue-400"}
                placeholder-gray-400`}
            />
            <motion.span
              initial={false}
              animate={{
                opacity: focusField === "email" ? 1 : 0,
                x: focusField === "email" ? 0 : -10,
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none"
              transition={{ duration: 0.2 }}
            >
              <i className="fas fa-envelope"></i>
            </motion.span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusField("password")}
              onBlur={() => setFocusField("")}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                ${focusField === "password"
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-300 focus:border-blue-400"}
                placeholder-gray-400`}
            />
            <motion.span
              initial={false}
              animate={{
                opacity: focusField === "password" ? 1 : 0,
                x: focusField === "password" ? 0 : -10,
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none"
              transition={{ duration: 0.2 }}
            >
              <i className="fas fa-lock"></i>
            </motion.span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60 text-lg tracking-wide"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <span className="text-gray-600 text-base">Chưa có tài khoản?</span>
        <button
          onClick={() => navigate("/register")}
          className="ml-2 text-blue-700 hover:underline font-semibold cursor-pointer text-base"
          type="button"
        >
          Đăng ký
        </button>
      </motion.div>

      {/* Nút quên mật khẩu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center"
      >
        <button
          type="button"
          className="text-blue-600 hover:underline font-medium text-base"
          onClick={() => navigate("/forgot-password")}
        >
          Quên mật khẩu?
        </button>
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 text-center font-semibold ${message.includes("thành công")
            ? "text-green-600"
            : "text-red-600"
            }`}
          role="alert"
        >
          {message}
        </motion.p>
      )}

      {token && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800 break-all text-center"
        >
          <b>Token:</b> <code>{token}</code>
        </motion.div>
      )}
    </motion.div>
  );
}