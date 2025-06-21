import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // thay thế icon

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
    <div className="relative bg-white/90 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-5 text-gray-800">Danh mục phụ tùng</h2>

      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3">
        {visibleAccessories.map((item, idx) => (
          <div
            key={idx}
            className="group flex flex-col items-center justify-center rounded-xl bg-white shadow-md hover:shadow-lg transition cursor-pointer p-2"
            style={{
              aspectRatio: "1/1",
              overflow: "hidden",
            }}
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <img
                src={item.img}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
                style={{ display: "block" }}
              />
            </div>
            <span
              className="text-sm font-medium text-gray-700 text-center mt-2 px-1"
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
          onClick={() => setShowAll((v) => !v)}
          aria-label={showAll ? "Thu gọn" : "Xem thêm"}
          className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-300 shadow hover:bg-gray-100 transition"
        >
          {showAll ? <ChevronUp size={18} className="text-gray-700" /> : <ChevronDown size={18} className="text-gray-700" />}
        </button>
      )}
    </div>
  );
}
