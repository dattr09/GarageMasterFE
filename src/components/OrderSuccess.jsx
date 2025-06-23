import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, Home } from "lucide-react";

const fadeInUpStyle = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px);}
  100% { opacity: 1; transform: translateY(0);}
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out both;
}
`;

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy mã đơn hàng từ state hoặc tạo mã ngẫu nhiên nếu không có
  const orderId =
    location.state?.orderId || "000" + Math.floor(1000 + Math.random() * 9000);

  return (
    <>
      <style>{fadeInUpStyle}</style>
      <div className="min-h-screen rounded-3xl flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-50 px-4 py-16">
        <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-green-400 to-green-500 p-8 text-white text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-3 animate-bounce drop-shadow-lg" />
            <h2 className="text-3xl md:text-4xl font-bold drop-shadow">
              Đặt hàng thành công!
            </h2>
          </div>
          <div className="p-8 text-center space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              Cảm ơn bạn đã mua hàng tại{" "}
              <span className="text-blue-700 font-bold">GarageMaster</span>.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 inline-flex items-center justify-center gap-2 text-blue-700 font-bold text-lg shadow-inner">
              <FileText className="w-5 h-5" />
              Mã hóa đơn:{" "}
              <span className="text-blue-900 tracking-wider">{orderId}</span>
            </div>
            <p className="text-blue-800 font-medium text-base">
              Đơn hàng của bạn đang được xử lý và sẽ giao trong thời gian sớm nhất.
            </p>
          </div>
          <div className="px-8 pb-8 text-center">
            <button
              // Xử lý quay về trang chủ
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-transform transform hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
