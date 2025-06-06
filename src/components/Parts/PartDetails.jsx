import React from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";

export default function PartDetails({ part, brands = [], onClose }) {
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : brandId;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-700 mb-8 text-center tracking-wide drop-shadow flex items-center justify-center gap-2">
          <FaInfoCircle /> Chi tiết phụ tùng
        </h3>
        <div className="flex flex-col items-center mb-6">
          {part.image ? (
            <img
              src={part.image}
              alt={part.name}
              className="w-32 h-32 object-contain rounded shadow"
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
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-10 py-2 rounded-xl shadow-lg transition text-lg flex items-center gap-2"
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