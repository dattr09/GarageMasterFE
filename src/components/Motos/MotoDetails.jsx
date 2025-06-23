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

export default function MotoDetails({ moto, brands, customers, onClose }) {
  // Lấy tên hãng xe từ brandId
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "N/A";
  };

  // Lấy tên chủ xe từ customerId
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "N/A";
  };

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-3xl border border-blue-100 relative animate-fade-in overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            title="Đóng"
            type="button"
          >
            <XCircle className="w-7 h-7" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <Info className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Chi tiết xe máy
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-y-4 text-gray-700 text-base">
            <DetailRow label="Biển số" value={moto.licensePlate} />
            <DetailRow label="Tên xe" value={moto.model} />
            <DetailRow label="Hãng xe" value={getBrandName(moto.brandId)} />
            <DetailRow label="Chủ xe" value={getCustomerName(moto.customerId)} />
            <DetailRow
              label="Ngày gửi"
              value={new Date(moto.dateOfSent).toLocaleDateString("vi-VN")}
            />
            <DetailRow
              label="Ghi chú"
              value={moto.notes && moto.notes.trim() !== "" ? moto.notes : "Không có"}
            />
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" /> Đóng
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
