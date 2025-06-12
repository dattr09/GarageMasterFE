import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent shadow-none z-50 flex items-center justify-between px-8 py-3">
      <div className="flex items-center gap-3">
        <img src="/Logo_Garage_DatHoangTu.png" alt="Logo" className="h-10 w-10" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="ml-3 px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="flex-1 flex justify-center items-center gap-6">
        <Link to="/" className="hover:text-blue-600 font-medium text-gray-700">Trang chủ</Link>
        <Link to="/services" className="hover:text-blue-600 font-medium text-gray-700">Dịch vụ</Link>
        <Link to="/customers" className="hover:text-blue-600 font-medium text-gray-700">Khách hàng</Link>
        <Link to="/parts" className="hover:text-blue-600 font-medium text-gray-700">Phụ tùng</Link>
        <Link to="/brands" className="hover:text-blue-600 font-medium text-gray-700">Hãng xe</Link>
        <Link to="/login" className="hover:text-blue-600 font-medium text-gray-700">Đăng nhập</Link>
      </div>
    </nav>
  );
}