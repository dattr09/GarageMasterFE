import React, { useEffect, useState } from "react";

const images = [
  "/public/image1.jpg",
  "/public/image2.jpg",
  "/public/image3.jpg",
  "/public/image4.jpg",
];

export default function Navbar() {
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
    <div className="w-full h-[70vh] relative overflow-hidden rounded shadow-lg">
      {/* Lớp phủ nền trắng trong suốt */}
      <div className="absolute inset-0 bg-white/60 z-0 rounded-xl"></div>
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`image-${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 rounded-xl ${current === idx ? "opacity-100" : "opacity-0"}`}
          style={{ zIndex: 1 }}
        />
      ))}
      {/* Nút chuyển trái/phải */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-black/30 text-white rounded-full w-12 h-12 flex items-center justify-center z-10"
        onClick={prevImage}
        aria-label="Ảnh trước"
        type="button"
      >
        <span className="text-xl flex items-center justify-center">&#8592;</span>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-black/30 text-white rounded-full w-12 h-12 flex items-center justify-center z-10"
        onClick={nextImage}
        aria-label="Ảnh sau"
        type="button"
      >
        <span className="text-xl flex items-center justify-center">&#8594;</span>
      </button>
      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${current === idx ? "bg-blue-600" : "bg-gray-300"} border-none outline-none`}
            style={{ cursor: "pointer" }}
            onClick={() => setCurrent(idx)}
            aria-label={`Chọn ảnh ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}