import React, { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { getAllParts } from "../services/PartsApi";
import { getAllBrands } from "../services/BrandApi"; // Thêm dòng này

// Navbar Carousel
const images = [
  "/public/image5.jpg",
  "/public/image6.jpg",
  "/public/image7.jpg",
  "/public/image8.jpg",
];

// Thêm mảng caption cho từng ảnh
const captions = [
  "GarageMaster\nGiải pháp phụ tùng xe máy toàn diện",
  "Đa dạng sản phẩm, chính hãng\nGiá tốt, dịch vụ tận tâm",
  "Hỗ trợ kỹ thuật và bảo hành uy tín",
  "Đặt hàng nhanh chóng, giao hàng tận nơi",
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
      {/* Ảnh nền */}
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`image-${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${current === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        />
      ))}
      {/* Lớp phủ màu */}
      <div className="absolute inset-0 bg-black/45 z-20"></div>
      {/* Thẻ chữ trên lớp phủ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4 text-center">
          {captions[current].split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </h1>
      </div>
      {/* Nút chuyển trái/phải và dots giữ nguyên */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent w-10 h-10 flex items-center justify-center z-40 transition"
        onClick={prevImage}
        aria-label="Ảnh trước"
        type="button"
        style={{ border: "none", boxShadow: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent w-10 h-10 flex items-center justify-center z-40 transition"
        onClick={nextImage}
        aria-label="Ảnh sau"
        type="button"
        style={{ border: "none", boxShadow: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border ${current === idx
              ? "bg-white border-white scale-110 shadow"
              : "bg-white/30 border-transparent"
              }`}
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
  { name: "/images/acc-windshield.png", img: "/images/acc-windshield.png" },
];

const ITEMS_PER_ROW = 6;
const ROWS_DEFAULT = 2;
const DEFAULT_ITEMS = ITEMS_PER_ROW * ROWS_DEFAULT;

function Accessories({ parts = [] }) {
  // Lấy danh mục duy nhất theo tên và ảnh
  const categories = Array.from(
    new Map(parts.map(item => [item.name, { name: item.name, img: item.image }])).values()
  );

  const [showAll, setShowAll] = useState(false);
  const visibleAccessories = showAll ? categories : categories.slice(0, DEFAULT_ITEMS);

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
      {categories.length > DEFAULT_ITEMS && (
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
function FeaturedProducts({ parts = [], brands = [] }) {
  const PRODUCTS_PER_PAGE = 5;
  // Lấy 10 sản phẩm đầu tiên làm nổi bật (hoặc tuỳ ý)
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
              key={item.id || item.name}
              className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg p-4 transition"
            >
              <img
                src={item.image || item.img}
                alt={item.name}
                className="w-20 h-20 object-contain mb-2"
              />
              <span className="font-medium text-gray-800">{item.name}</span>
              <span className="text-blue-600 font-semibold">
                {item.price ? item.price.toLocaleString("vi-VN") + " VND" : ""}
              </span>
              <span className="text-xs text-gray-500 mb-1">
                Tồn kho: {item.quantity ?? item.stock}
              </span>
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
          minHeight: "400px",
          position: "relative",
        }}
      >
        {/* Lớp phủ giúp dễ đọc chữ */}
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

// Trang tổng hợp
export default function HomePage() {
  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getAllParts().then(setParts);
    getAllBrands().then(setBrands);
  }, []);

  return (
    <div className="w-full max-w-9xl mx-auto px-4 flex flex-col gap-8">
      <NavbarCarousel />
      <Accessories parts={parts} />
      <FeaturedProducts parts={parts} brands={brands} />
    </div>
  );
}