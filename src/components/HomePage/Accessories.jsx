import React, { useState } from "react";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react"; // thêm icon

const ITEMS_PER_ROW = 9;
const ROWS_DEFAULT = 2;
const DEFAULT_ITEMS = ITEMS_PER_ROW * ROWS_DEFAULT;

export default function Accessories({ parts = [] }) {
  const categories = Array.from(
    new Map(parts.map(item => [item.name, { name: item.name, img: item.image }])).values()
  );
  const [showAll, setShowAll] = useState(false);
  const visibleAccessories = showAll ? categories : categories.slice(0, DEFAULT_ITEMS);

  return (
    <div className="relative bg-white/90 rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 drop-shadow-md flex items-center gap-2">
        <Settings2 className="w-6 h-6 text-blue-500" />
        Danh mục phụ tùng
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-4">
        {visibleAccessories.map((item, idx) => (
          <div
            key={idx}
            className="group flex flex-col items-center justify-center rounded-xl bg-white shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-3 border border-transparent hover:border-blue-300"
            style={{
              aspectRatio: "1/1",
              overflow: "hidden",
            }}
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span
              className="text-base font-medium text-gray-800 text-center mt-2 px-1"
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

      {/* Nút xem thêm / thu gọn */}
      {categories.length > DEFAULT_ITEMS && (
        <button
          onClick={() => setShowAll((v) => !v)}
          aria-label={showAll ? "Thu gọn" : "Xem thêm"}
          className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-300 shadow-lg hover:bg-blue-50 transition"
        >
          {showAll ? (
            <ChevronUp size={20} className="text-gray-700" />
          ) : (
            <ChevronDown size={20} className="text-gray-700" />
          )}
        </button>
      )}
    </div>
  );
}
