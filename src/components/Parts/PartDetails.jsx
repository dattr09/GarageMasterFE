import React from "react";
import { XCircle, Info } from "lucide-react";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function PartDetails({ part, brands = [], onClose }) {
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : brandId;
  };

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-3xl border border-blue-100 relative animate-fade-in overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
            title="Đóng"
            type="button"
          >
            <XCircle className="w-7 h-7" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <Info className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Chi tiết phụ tùng
            </h3>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-gray-700 text-base">
            <DetailRow label="Tên" value={part.name} />
            <DetailRow label="Số lượng" value={part.quantity} />
            <DetailRow label="Giá bán" value={formatCurrency(part.price)} />
            <DetailRow label="Giá nhập" value={formatCurrency(part.buyPrice)} />
            <DetailRow label="Giá NV" value={formatCurrency(part.empPrice)} />
            <DetailRow label="Đơn vị" value={part.unit} />
            <DetailRow label="Tồn kho tối thiểu" value={part.limitStock} />
            <DetailRow label="Hãng xe" value={getBrandName(part.brandId)} />
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Component hiển thị từng dòng chi tiết
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b pb-2 last:border-b-0">
      <span className="font-semibold text-gray-600 min-w-[130px]">{label}:</span>
      <span className="text-blue-900 text-right break-all">{value || "(Trống)"}</span>
    </div>
  );
}

// Định dạng tiền tệ VND
function formatCurrency(val) {
  return typeof val === "number"
    ? val.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    })
    : val;
}
