import React, { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

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

export default function Accessories() {
  const [showAll, setShowAll] = useState(false);
  const visibleAccessories = showAll ? accessories : accessories.slice(0, DEFAULT_ITEMS);

  return (
    <div className="bg-white/80 rounded-xl shadow p-6 my-6 relative">
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