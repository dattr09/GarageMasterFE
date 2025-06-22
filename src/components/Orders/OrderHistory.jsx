import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByUser } from "../../services/OrderApi";
import {
  ScrollText,
  CalendarDays,
  DollarSign,
  BadgeCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      getOrdersByUser(user.id).then(setOrders);
    }
  }, [user]);

  if (!user)
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        Bạn cần đăng nhập để xem lịch sử mua hàng.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 mt-8 animate-fade-in relative">
      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 font-bold shadow-lg border border-blue-200 hover:from-blue-200 hover:to-blue-400 hover:text-blue-900 hover:scale-105 transition-all duration-200 z-10"
        style={{ boxShadow: "0 2px 12px 0 rgba(59,130,246,0.12)" }}
      >
        <ArrowLeft className="w-5 h-5 animate-pulse" />
        <span>Quay lại</span>
      </button>

      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center drop-shadow">
        <ScrollText className="inline mr-2" /> Lịch sử mua hàng
      </h2>

      {orders.length === 0 ? (
        <div className="text-gray-400 text-center py-12 italic">
          <Truck className="mx-auto mb-2" size={36} />
          Chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
          <table className="min-w-full text-sm text-gray-700 whitespace-nowrap">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
              <tr>
                <th className="py-3 px-4 text-center font-semibold">
                  <ScrollText size={16} className="inline mr-1" /> Mã đơn
                </th>
                <th className="py-3 px-4 text-center font-semibold">
                  <CalendarDays size={16} className="inline mr-1" /> Ngày đặt
                </th>
                <th className="py-3 px-4 text-center font-semibold">
                  <DollarSign size={16} className="inline mr-1" /> Tổng tiền
                </th>
                <th className="py-3 px-4 text-center font-semibold">
                  <BadgeCheck size={16} className="inline mr-1" /> Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`transition text-center ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
                >
                  <td className="py-3 px-4 font-medium text-blue-700">
                    {`DDH${String(idx + 1).padStart(3, "0")}`}
                  </td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="py-3 px-4 text-center font-semibold text-green-600">
                    {Number(order.total).toLocaleString()} đ
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "Đang xử lý"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Đã giao"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {order.status || "Hoàn thành"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
