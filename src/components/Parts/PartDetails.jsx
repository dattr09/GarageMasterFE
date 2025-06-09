import React from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";

export default function PartDetails({ part, brands = [], onClose }) {
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : brandId;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          <FaTimes />
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow flex items-center justify-center gap-2">
          <FaInfoCircle /> Chi tiết phụ tùng
        </h3>
        <div className="flex flex-col items-center mb-6">
          {part.image ? (
            <img
              src={part.image}
              alt={part.name}
              className="w-32 h-32 object-contain rounded-2xl border border-blue-100 shadow"
            />
          ) : (
            <span className="text-gray-400 italic">Không có ảnh</span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 text-gray-700 text-base">
          <DetailRow label="Tên" value={part.name} />
          <DetailRow label="Số lượng" value={part.quantity} />
          <DetailRow
            label="Giá bán"
            value={part.price?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          />
          <DetailRow
            label="Giá nhập"
            value={part.buyPrice?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          />
          <DetailRow
            label="Giá NV"
            value={part.empPrice?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          />
          <DetailRow label="Đơn vị" value={part.unit} />
          <DetailRow label="Tồn kho tối thiểu" value={part.limitStock} />
          <DetailRow label="Hãng xe" value={getBrandName(part.brandId)} />
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
          >
            <FaTimes /> Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// Component hiển thị từng dòng chi tiết
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b last:border-b-0 pb-2">
      <span className="font-semibold text-gray-600">{label}:</span>
      <span className="text-blue-900">{value}</span>
    </div>
  );
}