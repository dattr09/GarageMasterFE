import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    }
    updateCartCount();

    // Lắng nghe sự kiện storage để cập nhật khi tab khác thay đổi giỏ hàng
    window.addEventListener("storage", updateCartCount);

    // Nếu bạn muốn cập nhật realtime khi thêm/xóa sản phẩm, có thể phát custom event và lắng nghe ở đây
    window.addEventListener("cartChanged", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartChanged", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent shadow-none z-50 px-8 py-3">
      <div className="flex items-center justify-between w-full">
        {/* Trái: Logo + tìm kiếm */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img src="/Logo_Garage_DatHoangTu.png" alt="Logo" className="h-10 w-10" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="ml-3 px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        {/* Giữa: Menu */}
        <div className="flex-1 flex justify-center items-center gap-6">
          <Link to="/" className="hover:text-blue-600 font-medium text-gray-700">Trang chủ</Link>
          <Link to="/customers" className="hover:text-blue-600 font-medium text-gray-700">Khách hàng</Link>
          <Link to="/parts" className="hover:text-blue-600 font-medium text-gray-700">Phụ tùng</Link>
          <Link to="/brands" className="hover:text-blue-600 font-medium text-gray-700">Hãng xe</Link>
          <Link to="/motos" className="hover:text-blue-600 font-medium text-gray-700">Quản lý xe</Link>
          <Link to="/repair-orders" className="hover:text-blue-600 font-medium text-gray-700">Đơn sửa chữa</Link>
          <Link to="/employees" className="hover:text-blue-600 font-medium text-gray-700">Nhân viên</Link>
        </div>
        {/* Phải: Giỏ hàng + đăng nhập/đăng xuất */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Giỏ hàng */}
          <Link to="/cart" className="relative group">
            <span className="sr-only">Giỏ hàng</span>
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition p-2">
              {/* Heroicons shopping-cart */}
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
              </svg>
              {/* Badge số lượng sản phẩm */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                  {cartCount}
                </span>
              )}
            </span>
          </Link>
          {!user ? (
            <Link to="/login" className="hover:text-blue-600 font-medium text-gray-700">Đăng nhập</Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1 text-gray-700 font-semibold hover:text-blue-700 focus:outline-none"
              >
                Chào! {user.username || user.name || user.email}
                <svg className={`w-4 h-4 ml-1 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 animate-fade-in">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg font-semibold"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}