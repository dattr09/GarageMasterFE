import React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./Login";
import Register from "./Register";

export default function AuthContainer() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return (
    <>
      {/* Nhúng CSS động gradient-x vào đây */}
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 6s ease-in-out infinite;
          }
        `}
      </style>
      <div className="flex items-center justify-center w-full min-h-screen animate-gradient-x bg-gradient-to-br from-blue-500 via-indigo-200 via-cyan-100 to-blue-200">
        <div
          className="relative bg-white/60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden max-w-3xl min-h-[500px] w-full"
        >
          {/* Logo & Slogan động */}
          <motion.div
            className="hidden md:flex flex-col items-center justify-center absolute top-0 left-0 h-full w-1/2 z-10
  bg-gradient-to-br from-blue-500 via-indigo-400 via-cyan-300 to-blue-200
  animate-gradient-x text-white px-10 py-12"
            initial={false}
            animate={{
              x: isRegister ? "100%" : "0%",
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <img
              src="/Logo_Garage_DatHoangTu.png"
              alt="GarageMaster Logo"
              style={{ width: "180px", height: "180px" }}
              className="mb-6 rounded-full"
            />
            <h3 className="text-3xl font-bold mb-3 text-white drop-shadow text-center tracking-wide">
              GarageMaster
            </h3>
            <p className="text-base font-medium text-blue-50 text-center px-2">
              Đối tác tin cậy cho mọi dịch vụ chăm sóc & sửa chữa xe của bạn.
            </p>
          </motion.div>
          {/* Form động */}
          <div className="absolute top-0 h-full w-1/2 right-0 md:block hidden z-20">
            <AnimatePresence mode="wait">
              {location.pathname === "/login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full flex items-center"
                >
                  <Login />
                </motion.div>
              )}
              {location.pathname === "/register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full flex items-center"
                  style={{ position: "absolute", left: "-100%", width: "100%" }}
                >
                  <Register />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Form động cho mobile */}
          <div className="md:hidden w-full p-4">
            <AnimatePresence mode="wait">
              {location.pathname === "/login" && (
                <motion.div
                  key="login-m"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <Login />
                </motion.div>
              )}
              {location.pathname === "/register" && (
                <motion.div
                  key="register-m"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <Register />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}