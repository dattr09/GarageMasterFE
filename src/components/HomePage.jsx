import React, { useEffect, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { getAllParts } from "../services/PartsApi";
import { getAllBrands } from "../services/BrandApi";

// ===================== Navbar Carousel =====================
const images = [
  "/public/image5.jpg",
  "/public/image6.jpg",
  "/public/image7.jpg",
  "/public/image8.jpg",
];

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

  const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="w-full h-[92vh] relative overflow-hidden rounded-xl bg-white">
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
      {/* Nút chuyển trái/phải */}
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

// ===================== Accessories =====================
const ITEMS_PER_ROW = 9;
const ROWS_DEFAULT = 2;
const DEFAULT_ITEMS = ITEMS_PER_ROW * ROWS_DEFAULT;

function Accessories({ parts = [] }) {
  const categories = Array.from(
    new Map(parts.map(item => [item.name, { name: item.name, img: item.image }])).values()
  );
  const [showAll, setShowAll] = useState(false);
  const visibleAccessories = showAll ? categories : categories.slice(0, DEFAULT_ITEMS);

  return (
    <div className="cates-wrapper relative bg-white/80 rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Danh mục phụ tùng</h2>
      <div className="cates-list row grid grid-cols-9 gap-1">
        {visibleAccessories.map((item, idx) => (
          <div
            key={idx}
            className="re-block flex flex-col items-center justify-center rounded-xl bg-white shadow cursor-pointer"
            style={{
              aspectRatio: "1/1",
              overflow: "hidden",
            }}
          >
            <img
              src={item.img}
              alt={item.name}
              style={{
                width: 80,
                height: 80,
                objectFit: "contain",
                marginBottom: 4,
                display: "block",
              }}
            />
            <span
              className="text-base font-medium text-gray-700 text-center px-1"
              style={{
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
              title={item.name}
            >
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

// ===================== Featured Products =====================
function FeaturedProducts({ parts = [], brands = [] }) {
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
          minHeight: "550px",
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

// ===================== Service Cards =====================
function ServiceCards() {
  const services = [
    {
      title: "Vận chuyển nhanh chóng",
      desc: "Vận chuyển nhanh chóng trong vòng 48H",
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M3 17V6a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v11M16 17h2a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1h-3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="17.5" cy="17.5" r="1.5" />
        </svg>
      ),
    },
    {
      title: "Sản phẩm chính hãng",
      desc: "Phụ tùng thay thế chính hãng",
      icon: (
        <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M12 3v18M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Hỗ trợ tư vấn online",
      desc: "Hỗ trợ tự vấn sản phẩm đa nền tảng",
      icon: (
        <svg className="w-10 h-10 text-yellow-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M17 8V7a5 5 0 0 0-10 0v1M5 8v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Thanh toán linh hoạt",
      desc: "Thanh toán bằng nhiều hình thức, đa nền tảng",
      icon: (
        <svg className="w-10 h-10 text-purple-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="10" rx="2" />
          <path d="M2 10h20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];
  return (
    <div className="w-full max-w-9xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {services.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center text-center bg-white rounded-xl shadow p-4 h-full min-h-[200px]"
          >
            {s.icon}
            <div className="font-semibold text-base text-gray-800 text-center mb-1">{s.title}</div>
            <div className="text-sm text-gray-500 text-center">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== Customer Reviews =====================
function CustomerReviews() {
  const [reviews, setReviews] = useState([
    { name: "Nguyễn Văn A", rating: 5, comment: "Dịch vụ rất tốt, giao hàng nhanh!" },
    { name: "Trần Thị B", rating: 4, comment: "Sản phẩm chính hãng, giá hợp lý." },
    { name: "Lê Văn C", rating: 5, comment: "Tư vấn nhiệt tình, sẽ ủng hộ tiếp." },
    { name: "Phạm Thị D", rating: 3, comment: "Giao hàng hơi chậm nhưng sản phẩm tốt." },
    { name: "Ngô Văn E", rating: 4, comment: "Đa dạng sản phẩm, giá tốt." },
    { name: "Trần Văn F", rating: 5, comment: "Rất hài lòng với dịch vụ." },
  ]);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [current, setCurrent] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) return;
    setReviews([{ ...form, rating: Number(form.rating) }, ...reviews]);
    setForm({ name: "", rating: 5, comment: "" });
    setCurrent(0);
  };

  const prevReview = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length);

  // Lấy 5 review liên tiếp, current ở giữa (nếu đủ)
  const getVisibleReviews = () => {
    const visible = [];
    const n = reviews.length;
    for (let i = -2; i <= 2; i++) {
      let idx = (current + i + n) % n;
      visible.push({ ...reviews[idx], idx, isActive: i === 0 });
    }
    return visible;
  };

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* Carousel đánh giá khách hàng */}
      <div className="w-full relative py-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Đánh giá khách hàng</h2>
        {/* Nút trái */}
        <button
          onClick={prevReview}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent w-12 h-12 flex items-center justify-center z-20"
          aria-label="Đánh giá trước"
          type="button"
          style={{ border: "none", boxShadow: "none" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Danh sách đánh giá 5 thẻ 1 hàng, active ở giữa */}
        <div className="flex gap-6 justify-center mx-auto max-w-5xl min-h-[260px]">
          {getVisibleReviews().map((r, idx) => {
            const isActive = idx === 2;
            return (
              <div
                key={r.idx}
                className={`bg-white/80 rounded-xl shadow p-6 min-w-[220px] max-w-xs flex-1 flex flex-col items-center justify-center aspect-square transition-all duration-300
                  ${isActive
                    ? "opacity-100 scale-105 border-2 border-blue-500 z-10"
                    : "opacity-50 scale-95"
                  }
                `}
                style={{
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <span className="font-semibold text-blue-700 text-lg text-center">{r.name}</span>
                <span className="flex my-2 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-6 h-6 ${i < r.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </span>
                <div className="text-gray-700 text-center text-base flex-1 flex items-center justify-center">{r.comment}</div>
              </div>
            );
          })}
        </div>
        {/* Nút phải */}
        <button
          onClick={nextReview}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent w-12 h-12 flex items-center justify-center z-20"
          aria-label="Đánh giá sau"
          type="button"
          style={{ border: "none", boxShadow: "none" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* Form đánh giá */}
      <div className="w-full max-w-md mx-auto bg-white/80 rounded-xl shadow p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Gửi đánh giá của bạn</h3>
        <form onSubmit={handleSubmit} className="space-y-3 w-full flex flex-col items-center">
          {/* Chọn số sao */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, rating: i + 1 }))}
                className="focus:outline-none"
                tabIndex={0}
                aria-label={`Chọn ${i + 1} sao`}
              >
                <svg
                  className={`w-7 h-7 ${i < form.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966a1 1 0 01-1.176 1.176l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454a1 1 0 01-1.176-1.176l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394a1 1 0 01.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full justify-center items-center">
            <input
              type="text"
              name="name"
              placeholder="Tên của bạn"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 flex-1 max-w-xs"
              required
            />
          </div>
          <textarea
            name="comment"
            placeholder="Nhận xét của bạn"
            value={form.comment}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full max-w-xl mx-auto"
            rows={3}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold mx-auto"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>
    </div>
  );
}

// ===================== Trang tổng hợp =====================
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
      <ServiceCards />
      <Accessories parts={parts} />
      <FeaturedProducts parts={parts} brands={brands} />
      <CustomerReviews />
    </div>
  );
}