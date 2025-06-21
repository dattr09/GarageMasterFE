import React, { useEffect, useState } from "react";

export default function FeaturedProducts({ parts = [], brands = [] }) {
  const PRODUCTS_PER_PAGE = 5;
  const featuredProducts = parts.slice(0, 10);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(featuredProducts.length - PRODUCTS_PER_PAGE + 1, 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const handleAddToCart = (item) => {
    // Lấy giỏ hàng hiện tại từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartChanged"));
    alert(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const handleBuy = (item) => {
    alert(`Mua ngay ${item.name}!`);
  };

  const currentProducts = featuredProducts.slice(
    page,
    page + PRODUCTS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      {/* Card 1: Sản phẩm nổi bật */}
      <div className="bg-white/80 rounded-xl shadow p-6 relative">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Sản phẩm nổi bật</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-4">
          {currentProducts.map((item, idx) => (
            <div
              key={item.id || item.name}
              className="flex flex-col items-center bg-white rounded-2xl shadow-lg hover:shadow-2xl p-5 transition-all duration-300 border border-transparent hover:border-blue-400 group"
              style={{ minHeight: 260 }}
            >
              <img
                src={item.image || item.img}
                alt={item.name}
                className="w-24 h-24 object-contain mb-3 rounded-xl group-hover:scale-105 transition"
              />
              <span className="font-semibold text-gray-800 text-base mb-1">{item.name}</span>
              <span className="text-blue-600 font-bold text-lg mb-1">
                {item.price ? item.price.toLocaleString("vi-VN") + " VND" : ""}
              </span>
              <span className="text-xs text-gray-500 mb-2">
                Tồn kho: {item.quantity ?? item.stock}
              </span>
              <div className="flex gap-2 mt-auto">
                <button
                  className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow transition"
                  onClick={() => handleBuy(item)}
                >
                  Mua ngay
                </button>
                <button
                  className="bg-green-600 hover:bg-green-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow transition"
                  onClick={() => handleAddToCart(item)}
                >
                  Thêm giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 absolute bottom-3 left-1/2 -translate-x-1/2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-200
                ${page === idx
                  ? "border-white bg-white-600 shadow"
                  : "border-blue-200 bg-transparent hover:border-gray-600"
                }`}
              style={{
                outline: "none",
                cursor: "pointer",
                backgroundClip: "padding-box",
              }}
              onClick={() => setPage(idx)}
              aria-label={`Trang ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
      {/* Card 2: Phụ tùng chính hãng */}
      <div className="bg-white/80 rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Phụ tùng chính hãng</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-2">
          {brands.slice(0, 10).map((brand) => (
            <div
              key={brand.id || brand.name}
              className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg p-4 transition"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-20 h-20 object-contain mb-2"
              />
              <span className="font-medium text-gray-800">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Card 3: Giới thiệu */}
      <div
        className="rounded-xl shadow p-6 text-gray-700"
        style={{
          backgroundImage: "url('/public/about.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "550px",
          position: "relative",
        }}
      >
        <div className="absolute inset-0 bg-black/30 rounded-xl"></div>
        <div className="relative z-10 text-left px-2 md:px-8 py-2">
          <h4 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300 drop-shadow-lg">Giới thiệu GarageMaster</h4>
          <p className="mb-4 text-white md:text-xl font-medium drop-shadow">
            GarageMaster là nền tảng cung cấp phụ tùng, phụ kiện ô tô và xe máy chính hãng, chất lượng cao.
          </p>
          <p className="mb-4 text-white md:text-xl font-medium drop-shadow">
            Chúng tôi hợp tác với nhiều thương hiệu uy tín, đảm bảo nguồn gốc xuất xứ rõ ràng cho từng sản phẩm.
          </p>
          <p className="mb-4 text-white md:text-xl font-medium drop-shadow">
            Khách hàng được hỗ trợ tư vấn kỹ thuật tận tâm, cùng chính sách bảo hành minh bạch.
          </p>
          <p className="mb-4 text-white md:text-xl font-medium drop-shadow">
            Đặt hàng nhanh chóng, giao hàng tận nơi trên toàn quốc với giá cả cạnh tranh.
          </p>
          <p className="text-white md:text-xl font-medium drop-shadow">
            GarageMaster cam kết đồng hành cùng khách hàng trên mọi hành trình, mang lại sự an tâm và tiện lợi tối đa.
          </p>
        </div>
      </div>
    </div>
  );
}