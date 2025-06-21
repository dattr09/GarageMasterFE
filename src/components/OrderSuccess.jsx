import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy mã hóa đơn từ state truyền qua navigate
  const orderId = location.state?.orderId || "000" + Math.floor(1000 + Math.random() * 9000);

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 mt-16 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">Đặt hàng thành công!</h2>
      <div className="text-lg text-gray-700 mb-6">
        Cảm ơn bạn đã đặt hàng tại <b>GarageMaster</b>.<br />
        Mã hóa đơn của bạn là: <span className="text-blue-700 font-bold text-xl">{orderId}</span>
      </div>
      <div className="text-xl text-blue-700 font-semibold mb-8">
        Chúc mừng bạn! Đơn hàng sẽ được xử lý và giao sớm nhất.
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-2 rounded-xl font-bold shadow transition"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
}