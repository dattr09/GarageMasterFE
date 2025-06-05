import React from "react";

export default function BrandDetails({ brand, parts, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-3xl border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Chi tiết hãng xe
        </h3>
        {/* Bảng thông tin hãng xe */}
        <div className="mb-10">
          <div className="bg-white rounded-xl shadow border border-blue-100 p-6 mb-8">
            <table className="min-w-full bg-white rounded-lg shadow border">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="py-2 px-4 text-center">Hãng xe</th>
                  <th className="py-2 px-4 text-center">Ảnh</th>
                  {/* <th className="py-2 px-4 text-center">ID</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 text-center text-blue-900 text-lg border-b">
                    {brand.name}
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {brand.image && (
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="h-14 w-14 object-contain mx-auto"
                      />
                    )}
                  </td>
                  {/* <td className="py-3 px-4 text-center text-blue-900 text-lg border-b">
                  {brand.id}
                </td> */}
                </tr>
              </tbody>
            </table>
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
                        {part.price?.toLocaleString()}₫
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
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-10 py-2 rounded-xl shadow-lg transition text-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}