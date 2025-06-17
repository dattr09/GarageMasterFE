import React from "react";

export default function MotoDetails({ moto, brands, customers, onClose }) {
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "N/A";
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
        >
          ×
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Chi tiết xe
        </h3>
        <div className="grid grid-cols-1 gap-4 text-gray-700 text-base">
          <DetailRow label="Biển số" value={moto.licensePlate} />
          <DetailRow label="Model" value={moto.model} />
          <DetailRow label="Hãng xe" value={getBrandName(moto.brandId)} />
          <DetailRow label="Chủ xe" value={getCustomerName(moto.customerId)} />
          <DetailRow
            label="Ngày gửi"
            value={new Date(moto.dateOfSent).toLocaleDateString("vi-VN")}
          />
          <DetailRow label="Ghi chú" value={moto.notes || "Không có"} />
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

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b last:border-b-0 pb-2">
      <span className="font-semibold text-gray-600">{label}:</span>
      <span className="text-blue-900">{value}</span>
    </div>
  );
}