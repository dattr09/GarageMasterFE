import React, { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

// Navbar Carousel
const images = [
  "/public/image1.jpg",
  "/public/image2.jpg",
  "/public/image3.jpg",
  "/public/image4.jpg",
];

function NavbarCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="w-full h-[75vh] relative overflow-hidden rounded-xl bg-white">
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`image-${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${current === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        />
      ))}
      {/* Nút chuyển trái */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent w-10 h-10 flex items-center justify-center z-30 transition"
        onClick={prevImage}
        aria-label="Ảnh trước"
        type="button"
        style={{ border: "none", boxShadow: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Nút chuyển phải */}
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent w-10 h-10 flex items-center justify-center z-30 transition"
        onClick={nextImage}
        aria-label="Ảnh sau"
        type="button"
        style={{ border: "none", boxShadow: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${current === idx ? "bg-white border-blue-500 scale-125" : "bg-white/60 border-white"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Chọn ảnh ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

// Accessories
const accessories = [
  { name: "Lốp xe", img: "/images/acc-tire.png" },
  { name: "Ắc quy", img: "/images/acc-battery.png" },
  { name: "Dầu nhớt", img: "/images/acc-oil.png" },
  { name: "Phanh", img: "/images/acc-brake.png" },
  { name: "Đèn pha", img: "/images/acc-headlight.png" },
  { name: "Gương chiếu hậu", img: "/images/acc-mirror.png" },
  { name: "Bugi", img: "/images/acc-sparkplug.png" },
  { name: "Lọc gió", img: "/images/acc-airfilter.png" },
  { name: "Dây curoa", img: "/images/acc-belt.png" },
  { name: "Má phanh", img: "/images/acc-brakepad.png" },
  { name: "Còi xe", img: "/images/acc-horn.png" },
  { name: "Bình xăng", img: "/images/acc-tank.png" },
  { name: "Lọc dầu", img: "/images/acc-oilfilter.png" },
  { name: "Cảm biến", img: "/images/acc-sensor.png" },
  { name: "Bơm xăng", img: "/images/acc-fuelpump.png" },
  { name: "Dây điện", img: "/images/acc-wire.png" },
  { name: "Ống xả", img: "/images/acc-exhaust.png" },
  { name: "Kính chắn gió", img: "/images/acc-windshield.png" },
];

const ITEMS_PER_ROW = 6;
const ROWS_DEFAULT = 2;
const DEFAULT_ITEMS = ITEMS_PER_ROW * ROWS_DEFAULT;

function Accessories() {
  const [showAll, setShowAll] = useState(false);
  const visibleAccessories = showAll ? accessories : accessories.slice(0, DEFAULT_ITEMS);

  return (
    <div className="bg-white/80 rounded-xl shadow p-6 relative">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Danh mục phụ tùng</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {visibleAccessories.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg p-3 transition"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-14 h-14 object-contain mb-2"
            />
            <span className="text-sm font-medium text-gray-700 text-center">
              {item.name}
            </span>
          </div>
        ))}
      </div>
      {accessories.length > DEFAULT_ITEMS && (
        <button
          className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow p-0 border border-gray-200 hover:bg-gray-100 transition"
          onClick={() => setShowAll((v) => !v)}
          aria-label={showAll ? "Thu gọn" : "Xem thêm"}
        >
          {showAll ? <AiOutlineUp size={15} /> : <AiOutlineDown size={15} />}
        </button>
      )}
    </div>
  );
}

// Featured Products
const featuredProducts = [
  { name: "Lốp Michelin", img: "/images/acc-tire.png", price: "1.200.000đ", stock: 12 },
  { name: "Ắc quy GS", img: "/images/acc-battery.png", price: "950.000đ", stock: 8 },
  { name: "Dầu nhớt Castrol", img: "/images/acc-oil.png", price: "350.000đ", stock: 20 },
  { name: "Phanh đĩa Brembo", img: "/images/acc-brake.png", price: "2.000.000đ", stock: 5 },
  { name: "Đèn pha LED", img: "/images/acc-headlight.png", price: "800.000đ", stock: 10 },
  { name: "Gương chiếu hậu cao cấp", img: "/images/acc-mirror.png", price: "400.000đ", stock: 15 },
  { name: "Bugi NGK", img: "/images/acc-sparkplug.png", price: "120.000đ", stock: 30 },
  { name: "Lọc gió Bosch", img: "/images/acc-airfilter.png", price: "180.000đ", stock: 25 },
  { name: "Dây curoa Gates", img: "/images/acc-belt.png", price: "250.000đ", stock: 18 },
  { name: "Má phanh Nissin", img: "/images/acc-brakepad.png", price: "320.000đ", stock: 22 },
  { name: "Còi xe Hella", img: "/images/acc-horn.png", price: "90.000đ", stock: 40 },
];

const genuineParts = [
  { name: "Lọc dầu Toyota", img: "/images/acc-oilfilter.png", price: "220.000đ", stock: 15 },
  { name: "Bugi Denso", img: "/images/acc-sparkplug.png", price: "130.000đ", stock: 20 },
  { name: "Má phanh Honda", img: "/images/acc-brakepad.png", price: "350.000đ", stock: 10 },
  { name: "Ắc quy Panasonic", img: "/images/acc-battery.png", price: "1.100.000đ", stock: 7 },
  { name: "Lọc gió Hyundai", img: "/images/acc-airfilter.png", price: "200.000đ", stock: 12 },
];

const PRODUCTS_PER_PAGE = 5;

function FeaturedProducts() {
  const [page, setPage] = useState(0);
  const totalPages = featuredProducts.length - PRODUCTS_PER_PAGE + 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const handleAddToCart = (item) => {
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
      <div className="bg-white/80 rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Sản phẩm nổi bật</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-4">
          {currentProducts.map((item, idx) => (
            <div
              key={item.name}
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
                  onClick={() => handleBuy(item)}
                >
                  Mua ngay
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleAddToCart(item)}
                >
                  Thêm giỏ hàng
                </button>
              </div>
            </div>
          ))}
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
      {/* Card 2: Phụ tùng chính hãng */}
      <div className="bg-white/80 rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Phụ tùng chính hãng</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-2">
          {genuineParts.map((item) => (
            <div
              key={item.name}
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
                  onClick={() => handleBuy(item)}
                >
                  Mua ngay
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleAddToCart(item)}
                >
                  Thêm giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Card 3: Giới thiệu */}
      <div className="bg-blue-50 rounded-xl shadow p-6 text-gray-700 text-center">
        <h4 className="text-lg font-semibold mb-2 text-blue-700">Giới thiệu GarageMaster</h4>
        <p>
          GarageMaster cung cấp các sản phẩm phụ tùng, phụ kiện ô tô chính hãng và chất lượng cao.
          Chúng tôi cam kết mang đến cho khách hàng sự lựa chọn đa dạng, giá cả hợp lý và dịch vụ tận tâm.
        </p>
      </div>
    </div>
  );
}

// Trang tổng hợp
export default function HomePage() {
  return (
    <div className="w-full max-w-9xl mx-auto px-4 flex flex-col gap-8">
      <NavbarCarousel />
      <Accessories />
      <FeaturedProducts />
    </div>
  );
}