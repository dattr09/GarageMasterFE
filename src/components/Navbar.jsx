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
    <div className="w-full h-[70vh] relative overflow-hidden rounded-xl">
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`image-${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover ${current === idx ? "" : "hidden"}`}
          style={{ zIndex: 1 }}
        />
      ))}
      {/* Nút chuyển trái */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent text-white w-12 h-20 flex items-center justify-center z-10"
        onClick={prevImage}
        aria-label="Ảnh trước"
        type="button"
        style={{ border: "none", boxShadow: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Nút chuyển phải */}
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-white w-12 h-20 flex items-center justify-center z-10"
        onClick={nextImage}
        aria-label="Ảnh sau"
        type="button"
        style={{ border: "none", boxShadow: "none" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}