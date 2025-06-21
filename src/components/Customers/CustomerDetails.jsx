import React from "react";
import { XCircle, User, Mail, Phone, MapPin } from "lucide-react";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function CustomerDetails({ customer, onClose }) {
  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-blue-100 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
            title="Đóng"
            type="button"
          >
            <XCircle className="w-7 h-7" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <User className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Chi tiết khách hàng
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 text-base text-gray-700">
            <DetailRow icon={<User className="text-blue-600 w-5 h-5" />} label="Tên" value={customer.name} />
            <DetailRow icon={<Mail className="text-blue-600 w-5 h-5" />} label="Email" value={customer.email} />
            <DetailRow icon={<Phone className="text-blue-600 w-5 h-5" />} label="Số điện thoại" value={customer.phone} />
            <DetailRow icon={<MapPin className="text-blue-600 w-5 h-5" />} label="Địa chỉ" value={customer.address} />
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
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

function DetailRow({ label, value, icon }) {
  return (
    <div className="flex items-center border-b pb-2 last:border-b-0">
      <div className="flex items-center gap-2 min-w-[120px]">
        {icon}
        <span className="font-semibold text-gray-600">{label}:</span>
      </div>
      <div className="flex-1 flex items-center justify-end text-blue-900">
        {value || "(Trống)"}
      </div>
    </div>
  );
}
