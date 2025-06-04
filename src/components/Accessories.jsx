import React from "react";

const accessories = [
  { name: "Lốp xe", img: "/images/acc-tire.png" },
  { name: "Ắc quy", img: "/images/acc-battery.png" },
  { name: "Dầu nhớt", img: "/images/acc-oil.png" },
  { name: "Phanh", img: "/images/acc-brake.png" },
  { name: "Đèn pha", img: "/images/acc-headlight.png" },
  { name: "Gương chiếu hậu", img: "/images/acc-mirror.png" },
];

export default function Accessories() {
  return (
    <div className="bg-white/80 rounded-xl shadow p-6 my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Danh mục phụ tùng</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {accessories.map((item, idx) => (
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
    </div>
  );
}