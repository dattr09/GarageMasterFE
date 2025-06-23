import React, { useState, useEffect } from "react";
import { getAllReviews, createOrUpdateReview } from "../../services/ReviewApi";

// Che email, ví dụ: tu******10@gmail.com
function maskEmail(email) {
  if (!email) return "";
  const [name, domain] = email.split("@");
  if (name.length <= 2) return email;
  return (
    name.slice(0, 2) +
    "*".repeat(Math.max(0, name.length - 4)) +
    name.slice(-2) +
    "@" +
    domain
  );
}

// Lấy user hiện tại từ localStorage
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user")) || null;
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [current, setCurrent] = useState(0);

  const user = getCurrentUser();

  useEffect(() => {
    // Lấy tất cả đánh giá khi load component
    getAllReviews().then(setReviews).catch(() => setReviews([]));
  }, []);

  // Xử lý thay đổi input form đánh giá
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi đánh giá mới hoặc cập nhật đánh giá
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createOrUpdateReview({
      userId: user.id,
      email: user.email,
      rating: form.rating,
      comment: form.comment
    });
    getAllReviews().then((data) => {
      setReviews(data);
      setCurrent(data.length > 3 ? data.length - 3 : 0);
    });
  };

  // Lọc đánh giá hợp lệ (có userId, email, không trùng userId)
  const realReviews = reviews.filter(
    (r, idx, arr) =>
      r.userId &&
      r.email &&
      arr.findIndex(rr => rr.userId === r.userId) === idx
  );

  // Lấy n review liên tiếp cho carousel
  function getCarouselReviews(count = 4) {
    const n = realReviews.length;
    if (n <= count) return realReviews;
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(realReviews[(current + i) % n]);
    }
    return result;
  }

  // Chuyển carousel về trước
  const prev = () => {
    setCurrent((prev) => {
      const n = realReviews.length;
      return (prev - 1 + n) % n;
    });
  };

  // Chuyển carousel về sau
  const next = () => {
    setCurrent((prev) => {
      const n = realReviews.length;
      return (prev + 1) % n;
    });
  };

  return (
    <div className="flex flex-col gap-10 items-center w-full">
      {/* Carousel đánh giá khách hàng */}
      <div className="w-full relative py-2">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Đánh giá khách hàng
        </h2>
        {realReviews.length > 0 ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              {realReviews.length > 4 && (
                <button
                  onClick={prev}
                  className="rounded-full bg-blue-100 hover:bg-blue-300 text-blue-700 p-2 shadow transition flex items-center justify-center"
                  aria-label="Trước"
                >
                  {/* Heroicons chevron-left */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center mx-auto max-w-6xl">
                {getCarouselReviews(4).map((r, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-3 w-[250px] h-[250px] flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-base font-bold text-blue-700 mb-1 shadow">
                      {maskEmail(r.email).slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-blue-700 text-sm mb-1">
                      {maskEmail(r.email)}
                    </span>
                    <span className="flex my-1 justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < r.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                    </span>
                    <div className="text-gray-700 text-base flex-1 flex items-center justify-center italic max-h-16 overflow-hidden break-words text-center">
                      “{r.comment}”
                    </div>
                  </div>
                ))}
              </div>
              {realReviews.length > 4 && (
                <button
                  onClick={next}
                  className="rounded-full bg-blue-100 hover:bg-blue-300 text-blue-700 p-2 shadow transition flex items-center justify-center"
                  aria-label="Sau"
                >
                  {/* Heroicons chevron-right */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic text-center py-12">Chưa có đánh giá nào.</div>
        )}
      </div>
      {/* Form chỉ hiện khi user đã đăng nhập */}
      {user ? (
        <div className="w-full max-w-md mx-auto bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">Gửi đánh giá của bạn</h3>
          <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-2 justify-center">
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
            <div className="w-full text-center text-gray-700 mb-2">
              <b>Email:</b> {maskEmail(user.email)}
            </div>
            <div className="w-full flex justify-center">
              <textarea
                name="comment"
                placeholder="Nhận xét của bạn"
                value={form.comment}
                onChange={handleChange}
                className="border-2 border-blue-200 rounded px-3 py-2 w-full max-w-xl mx-auto focus:border-blue-500 outline-none text-center"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-2 rounded-xl font-bold mx-auto shadow-lg transition"
            >
              Gửi đánh giá
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-gray-500 text-center">
          <h3 className="text-xl font-bold mb-2 text-blue-700">Bạn cần đăng nhập để gửi đánh giá</h3>
        </div>
      )}
    </div>
  );
}