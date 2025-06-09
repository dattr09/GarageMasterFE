import React from "react";

export default function BrandDetails({ brand, parts, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          ×
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Chi tiết hãng xe
        </h3>
        {/* Thông tin hãng xe */}
        <div className="flex flex-col items-center mb-10">
          {brand.image ? (
            <img
              src={brand.image}
              alt={brand.name}
              className="w-32 h-32 object-contain rounded-2xl border border-blue-100 shadow mx-auto"
            />
          ) : (
            <span className="text-gray-400 italic">Không có ảnh</span>
          )}
          <div className="mt-4 text-xl font-semibold text-blue-900">
            {brand.name}
          </div>
        </div>
        {/* Bảng danh sách linh kiện */}
        <div className="bg-white rounded-xl shadow border border-blue-100 p-6">
          <h4 className="text-xl font-bold text-blue-700 mb-4 text-center">
            Danh sách linh kiện
          </h4>
          <div className="overflow-x-auto">
            {parts.length === 0 ? (
              <div className="text-center text-gray-500 italic">
                Không có linh kiện nào.
              </div>
            ) : (
              <table className="min-w-full bg-white rounded-lg shadow border">
                <thead>
                  <tr className="bg-blue-100 text-blue-800">
                    <th className="py-2 px-4 text-center">Tên phụ tùng</th>
                    <th className="py-2 px-4 text-center">Số lượng</th>
                    <th className="py-2 px-4 text-center">Giá bán</th>
                    <th className="py-2 px-4 text-center">Đơn vị</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part) => (
                    <tr
                      key={part.id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="py-2 px-4 text-center">{part.name}</td>
                      <td className="py-2 px-4 text-center">{part.quantity}</td>
                      <td className="py-2 px-4 text-center">
                        {part.price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="py-2 px-4 text-center">{part.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}