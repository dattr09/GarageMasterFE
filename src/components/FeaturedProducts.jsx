import React, { useState, useEffect } from "react";

const featuredProducts = [
  { name: "Lốp Michelin", img: "/images/acc-tire.png", price: "1.200.000đ", stock: 12 },
  { name: "Ắc quy GS", img: "/images/acc-battery.png", price: "950.000đ", stock: 8 },
  { name: "Dầu nhớt Castrol", img: "/images/acc-oil.png", price: "350.000đ", stock: 20 },
  { name: "Phanh đĩa Brembo", img: "/images/acc-brake.png", price: "2.000.000đ", stock: 5 },
  { name: "Đèn pha LED", img: "/images/acc-headlight.png", price: "800.000đ", stock: 10 },
  { name: "Gương chiếu hậu cao cấp", img: "/images/acc-mirror.png", price: "400.000đ", stock: 15 },
];

const PRODUCTS_PER_PAGE = 5;

export default function FeaturedProducts() {
  const [page, setPage] = useState(0);
  const totalPages = featuredProducts.length - PRODUCTS_PER_PAGE + 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const handleAddToCart = (idx) => {
    alert(`Đã thêm ${featuredProducts[idx].name} vào giỏ hàng!`);
  };

  const handleBuy = (idx) => {
    alert(`Mua ngay ${featuredProducts[idx].name}!`);
  };

  const currentProducts = featuredProducts.slice(
    page,
    page + PRODUCTS_PER_PAGE
  );

  return (
    <div className="bg-white/80 rounded-xl shadow p-6 my-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Sản phẩm nổi bật</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-4">
        {currentProducts.map((item, idx) => {
          const realIdx = page + idx;
          return (
            <div
              key={realIdx}
              className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg p-4 transition"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-20 h-20 object-contain mb-2"
              />
              <span className="font-medium text-gray-800">{item.name}</span>
              <span className="text-blue-600 font-semibold">{item.price}</span>
              <span className="text-xs text-gray-500 mb-1">Tồn kho: {item.stock}</span>
              <div className="flex gap-2 mt-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleBuy(realIdx)}
                >
                  Mua ngay
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleAddToCart(realIdx)}
                >
                  Thêm giỏ hàng
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Dots indicator */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${page === idx ? "bg-blue-600" : "bg-gray-300"} border-none outline-none`}
            style={{ cursor: "pointer" }}
            onClick={() => setPage(idx)}
            aria-label={`Trang ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}