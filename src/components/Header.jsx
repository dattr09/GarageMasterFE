import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown, LogOut } from "lucide-react";

const fadeInUpStyle = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(10px);}
  100% { opacity: 1; transform: translateY(0);}
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out both;
}
`;

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    }
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
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

  // Search logic
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("parts");
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);

  const partsList = ["Nhớt động cơ", "Bugi", "Lốp xe", "Ắc quy", "Phanh đĩa", "Đèn pha", "Lọc gió"];
  const brandsList = ["Honda", "Yamaha", "Suzuki", "SYM", "Piaggio", "Kawasaki", "Ducati"];

  useEffect(() => {
    const data = searchType === "parts"
      ? partsList.filter(item => item.toLowerCase().includes(search.toLowerCase()))
      : brandsList.filter(item => item.toLowerCase().includes(search.toLowerCase()));
    setSuggestions(search ? data.slice(0, 5) : []);
  }, [search, searchType]);

  const handleSearch = (e) => {
    e.preventDefault();
    const route = searchType === "parts" ? "/parts" : "/brands";
    navigate(`${route}?search=${encodeURIComponent(search)}`);
    setSearch("");
    setSuggestions([]);
    searchInputRef.current?.blur();
  };

  return (
    <>
      <style>{fadeInUpStyle}</style>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 md:px-10 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo + Search */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img
                src="/Logo_Garage_DatHoangTu.png"
                alt="Logo"
                className="h-10 w-10 rounded-full cursor-pointer"
                style={{ boxShadow: "none", border: "none" }}
              />
            </Link>
            <form
              onSubmit={handleSearch}
              className="relative flex items-center bg-white rounded-xl shadow focus-within:ring-2 focus-within:ring-blue-300"
              autoComplete="off"
            >
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="h-10 px-3 rounded-l-xl bg-blue-50 text-blue-700 font-semibold border-none outline-none focus:ring-0"
                style={{ minWidth: 110 }}
              >
                <option value="parts">Phụ tùng</option>
                <option value="brands">Hãng xe</option>
              </select>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchType === "parts" ? "Tìm phụ tùng..." : "Tìm hãng xe..."}
                className="h-10 px-4 pr-10 rounded-r-xl bg-transparent outline-none text-gray-700 w-44 md:w-64"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800"
                aria-label="Tìm kiếm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-3.5-3.5" />
                </svg>
              </button>
              {suggestions.length > 0 && (
                <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-blue-100 rounded-xl shadow-lg z-50 animate-fade-in-up">
                  {suggestions.map((item, idx) => (
                    <li
                      key={item}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${idx === 0 ? "rounded-t-xl" : ""} ${idx === suggestions.length - 1 ? "rounded-b-xl" : ""}`}
                      onMouseDown={() => {
                        setSearch(item);
                        setSuggestions([]);
                        setTimeout(() => handleSearch({ preventDefault: () => { } }), 100);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>

          {/* Main Menu */}
          <div className="hidden md:flex gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
            <Link to="/customers" className="hover:text-blue-600 transition">Khách hàng</Link>
            <Link to="/parts" className="hover:text-blue-600 transition">Phụ tùng</Link>

            {/* Dropmenu Quản lý xe */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-blue-600 transition font-medium focus:outline-none whitespace-nowrap"
                onClick={() => setOpen(open === "car" ? false : "car")}
              >
                Quản lý xe
                <ChevronDown className="w-4 h-4" />
              </button>
              {open === "car" && (
                <div className="absolute left-0 mt-2 min-w-[180px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 animate-fade-in-up">
                  <button
                    onMouseDown={e => {
                      e.preventDefault();
                      setOpen(false);
                      navigate("/brands");
                    }}
                    className="block w-full text-left px-5 py-2 hover:bg-blue-50 rounded-t-xl text-gray-700 hover:text-blue-700 transition whitespace-nowrap"
                    type="button"
                  >
                    Hãng xe
                  </button>
                  <button
                    onMouseDown={e => {
                      e.preventDefault();
                      setOpen(false);
                      navigate("/motos");
                    }}
                    className="block w-full text-left px-5 py-2 hover:bg-blue-50 rounded-b-xl text-gray-700 hover:text-blue-700 transition whitespace-nowrap"
                    type="button"
                  >
                    Quản lý xe
                  </button>
                </div>
              )}
            </div>

            <Link to="/employees" className="hover:text-blue-600 transition whitespace-nowrap">Nhân viên</Link>

            {/* Dropmenu Quản lý dịch vụ */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-blue-600 transition font-medium focus:outline-none whitespace-nowrap"
                onClick={() => setOpen(open === "service" ? false : "service")}
              >
                Quản lý dịch vụ
                <ChevronDown className="w-4 h-4" />
              </button>
              {open === "service" && (
                <div className="absolute left-0 mt-2 min-w-[180px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 animate-fade-in-up">
                  <button
                    onMouseDown={e => {
                      e.preventDefault();
                      setOpen(false);
                      navigate("/repair-orders");
                    }}
                    className="block w-full text-left px-5 py-2 hover:bg-blue-50 rounded-t-xl text-gray-700 hover:text-blue-700 transition whitespace-nowrap"
                    type="button"
                  >
                    Đơn sửa chữa
                  </button>
                  <button
                    onMouseDown={e => {
                      e.preventDefault();
                      setOpen(false);
                      navigate("/invoices");
                    }}
                    className="block w-full text-left px-5 py-2 hover:bg-blue-50 rounded-b-xl text-gray-700 hover:text-blue-700 transition whitespace-nowrap"
                    type="button"
                  >
                    Hóa đơn
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cart + User */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-blue-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {!user ? (
              <Link to="/login" className="hover:text-blue-600 font-medium text-gray-700">
                Đăng nhập
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(open === "user" ? false : "user")}
                  className="flex items-center gap-1 text-gray-700 font-semibold hover:text-blue-700 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center shadow">
                    {user.username?.[0] || "U"}
                  </div>
                  <span>{user.username || user.name || user.email}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${open === "user" ? "rotate-180" : ""}`} />
                </button>
                {open === "user" && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 animate-fade-in-up">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-xl font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
