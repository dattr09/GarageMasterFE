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
  XCircle,
} from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Thêm state này
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
                  className={`transition text-center cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
                  onClick={() => setSelectedOrder({ ...order, orderIndex: idx })}
                >
                  <td className="py-3 px-4 font-medium text-blue-700">
                    {`DDH${String(idx + 1).padStart(3, "0")}`}
                  </td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="py-3 px-4 text-center font-semibold text-green-600">
                    {Number(order.total).toLocaleString()} VNĐ
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

      {/* Popup chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

// Modal chi tiết đơn hàng
function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-4xl border border-blue-100 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          <XCircle />
        </button>

        {/* Tiêu đề */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-wide drop-shadow flex justify-center items-center gap-2">
          <ScrollText className="w-6 h-6" /> Chi tiết đơn hàng
        </h3>

        {/* Thông tin đơn */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between gap-4 text-sm text-gray-700 font-medium bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div>
            <b>Mã đơn:</b> DDH{String((order.orderIndex ?? 0) + 1).padStart(3, "0")}
          </div>
          <div>
            <b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString("vi-VN")}
          </div>
          <div>
            <b>Trạng thái:</b> {order.status || "Hoàn thành"}
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <div className="bg-white rounded-xl shadow border border-blue-100 p-4 sm:p-6">
          <h4 className="text-lg sm:text-xl font-bold text-blue-700 mb-4 text-center">
            Danh sách sản phẩm
          </h4>
          <div className="overflow-x-auto">
            {order.items?.length === 0 ? (
              <div className="text-center text-gray-500 italic">Không có sản phẩm nào.</div>
            ) : (
              <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-blue-100 text-blue-800">
                  <tr>
                    <th className="py-2 px-4 text-center">Ảnh</th>
                    <th className="py-2 px-4 text-center">Tên sản phẩm</th>
                    <th className="py-2 px-4 text-center">Số lượng</th>
                    <th className="py-2 px-4 text-center">Đơn giá</th>
                    <th className="py-2 px-4 text-center">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="text-center hover:bg-blue-50 transition">
                      <td className="py-2 px-4">
                        <img
                          src={item.image || item.img}
                          alt={item.name}
                          className="w-14 h-14 object-contain rounded-xl border mx-auto"
                        />
                      </td>
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">{Number(item.price).toLocaleString()} VNĐ</td>
                      <td className="py-2 px-4 font-semibold text-blue-700">
                        {(item.price * item.quantity).toLocaleString()} VNĐ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="text-right mt-4 text-lg font-bold text-green-700">
          Tổng tiền: {Number(order.total).toLocaleString()} VNĐ
        </div>
      </div>
    </div>
  );
}
