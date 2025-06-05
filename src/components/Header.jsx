import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center justify-between px-8 py-3">
      <div className="flex items-center gap-3">
        <img src="/Logo_Garage_DatHoangTu.png" alt="Logo" className="h-10 w-10" />
        <span className="font-bold text-xl text-gray-800">GarageMaster</span>
      </div>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-blue-600 font-medium text-gray-700">Trang chủ</Link>
        <Link to="/services" className="hover:text-blue-600 font-medium text-gray-700">Dịch vụ</Link>
        <Link to="/contact" className="hover:text-blue-600 font-medium text-gray-700">Liên hệ</Link>
        <Link to="/parts" className="hover:text-blue-600 font-medium text-gray-700">Phụ tùng</Link>
        <Link to="/brands" className="hover:text-blue-600 font-medium text-gray-700">Hãng xe</Link>
        <Link to="/login" className="hover:text-blue-600 font-medium text-gray-700">Đăng nhập</Link>
      </div>
    </nav>
  );
}