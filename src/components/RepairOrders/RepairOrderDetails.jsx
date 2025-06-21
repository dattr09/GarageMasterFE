import React, { useEffect, useState } from "react";
import { getRepairOrderById } from "../../services/RepairOrderApi";
import { getAllCustomers } from "../../services/CustomerApi";
import { getRepairDetailsByOrderId } from "../../services/RepairDetailApi";
import { getAllParts } from "../../services/PartsApi";

export default function RepairOrderDetails({ orderId, orderIndex, onClose, refreshKey }) {
  const [order, setOrder] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [details, setDetails] = useState([]);
  const [parts, setParts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
    getAllCustomers().then(setCustomers);
    getRepairDetailsByOrderId(orderId).then((data) => {
      setDetails(data);
    });
    getAllParts().then(setParts);
  }, [orderId, refreshKey]);

  const fetchOrder = async () => {
    try {
      const data = await getRepairOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message || "Không lấy được dữ liệu");
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : customerId;
  };

  const getPartInfo = (partId) => {
    return parts.find((p) => p.id === partId) || {};
  };

  // Map trạng thái sang tiếng Việt
  const statusMap = {
    Pending: "Chờ xử lý",
    InProgress: "Đang sửa",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Đang tải...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          ×
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Chi tiết đơn sửa chữa
        </h3>
        <div className="space-y-3 text-lg">
          <div>
            <b>Mã đơn:</b> {orderIndex !== undefined ? `KH${String(orderIndex + 1).padStart(3, "0")}` : order.id}
          </div>
          <div><b>Biển số xe:</b> {order.licensePlate}</div>
          <div><b>Khách hàng:</b> {getCustomerName(order.customerId)}</div>
          <div><b>Trạng thái:</b> {statusMap[order.status] || order.status}</div>
          <div>
            <b>Ngày tạo:</b>{" "}
            {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}{" "}
            {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div><b>Tổng tiền:</b> {order.totalCost?.toLocaleString()} đ</div>
          <div><b>Mô tả:</b> {order.description}</div>
        </div>

        {/* Hiển thị danh sách phụ tùng */}
        <div className="mt-8">
          <h4 className="font-bold text-blue-700 mb-2">Phụ tùng thay thế</h4>
          {details.length === 0 ? (
            <div className="text-gray-500 italic">Không có phụ tùng thay thế.</div>
          ) : (
            <table className="min-w-full border text-base">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-3 border">Tên phụ tùng</th>
                  <th className="py-2 px-3 border">Số lượng</th>
                  <th className="py-2 px-3 border">Đơn giá</th>
                  <th className="py-2 px-3 border">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, i) => {
                  const part = getPartInfo(d.partId);
                  return (
                    <tr key={d.id || i}>
                      <td className="py-2 px-3 border">{part.name || d.partId}</td>
                      <td className="py-2 px-3 border text-center">{d.quantity}</td>
                      <td className="py-2 px-3 border text-right">{part.price?.toLocaleString() || 0} đ</td>
                      <td className="py-2 px-3 border text-right">{((part.price || 0) * d.quantity).toLocaleString()} đ</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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