import React, { useState, useEffect, useRef } from "react";
import { confirmEmail, login } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const CODE_LENGTH = 6;
const EXPIRE_SECONDS = 60;

export default function ConfirmEmail() {
  const [codeArr, setCodeArr] = useState(Array(CODE_LENGTH).fill(""));
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXPIRE_SECONDS);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Ưu tiên lấy email từ query string
    const params = new URLSearchParams(location.search);
    const queryEmail = params.get("email");
    if (queryEmail) {
      setEmail(queryEmail);
      localStorage.setItem("pendingEmail", queryEmail); // Lưu lại để dự phòng
    } else {
      // Nếu không có, lấy từ localStorage
      const savedEmail = localStorage.getItem("pendingEmail");
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        setMessage("Không tìm thấy email cần xác nhận.");
      }
    }
  }, [location.search]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Xử lý nhập từng ký tự
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9a-zA-Z]/g, "");
    if (!val) return;
    let arr = [...codeArr];
    arr[idx] = val.slice(-1);
    setCodeArr(arr);

    // Animation nhỏ khi nhập
    inputRefs.current[idx]?.classList.add("scale-110");
    setTimeout(() => {
      inputRefs.current[idx]?.classList.remove("scale-110");
    }, 120);

    // Focus sang ô tiếp theo nếu có
    if (val && idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // Xử lý backspace
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !codeArr[idx] && idx > 0) {
      let arr = [...codeArr];
      arr[idx - 1] = "";
      setCodeArr(arr);
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // Xử lý paste
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/[^0-9a-zA-Z]/g, "");
    if (paste.length === CODE_LENGTH) {
      setCodeArr(paste.split(""));
      // Focus vào ô cuối cùng
      inputRefs.current[CODE_LENGTH - 1]?.focus();
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const code = codeArr.join("");
    if (code.length !== CODE_LENGTH) {
      setMessage("Vui lòng nhập đủ mã xác nhận.");
      setLoading(false);
      return;
    }
    if (secondsLeft <= 0) {
      setMessage("Mã xác thực đã hết hạn. Vui lòng đăng ký lại.");
      setLoading(false);
      return;
    }
    try {
      const res = await confirmEmail({ email, code });
      setMessage(res.message || "Xác thực thành công!");
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.removeItem("pendingEmail"); // Xóa email đã xác nhận
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setMessage(error.message || "Xác nhận thất bại.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full px-8 py-4 relative"
    >
      {/* Thông báo nổi */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl px-6 py-4 shadow-2xl text-base font-semibold
          ${message.includes("thành công")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
            }
        `}
          role="alert"
        >
          {message.includes("thành công") ? (
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="#bbf7d0"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="#fef2f2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 9l-6 6m0-6l6 6"
              />
            </svg>
          )}
          <span className="whitespace-pre-line">{message}</span>
        </motion.div>
      )}

      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow">
          Xác nhận Email
        </h2>
        <form onSubmit={handleConfirm} className="space-y-8">
          <div>
            <label className="block font-semibold text-gray-700 mb-4 text-lg tracking-wide text-center">
              Nhập mã xác nhận
            </label>
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {codeArr.map((val, idx) => (
                <motion.input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  value={val}
                  autoFocus={idx === 0}
                  onChange={e => handleChange(e, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  className="w-14 h-14 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 transition-all duration-150 outline-none bg-white font-bold shadow-sm"
                  whileFocus={{ scale: 1.1 }}
                  whileTap={{ scale: 1.1 }}
                  disabled={secondsLeft <= 0}
                />
              ))}
            </div>
            <div className="text-center mt-4 text-gray-500 text-base font-semibold">
              {secondsLeft > 0
                ? `Mã xác thực sẽ hết hạn sau ${secondsLeft}s`
                : <span className="text-red-500">Mã xác thực đã hết hạn!</span>
              }
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || secondsLeft <= 0}
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60 text-lg tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Đang xác nhận...
              </>
            ) : (
              "Xác nhận"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
