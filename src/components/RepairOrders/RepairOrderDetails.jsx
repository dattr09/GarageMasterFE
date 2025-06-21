import React, { useEffect, useState } from "react";
import { getRepairOrderById } from "../../services/RepairOrderApi";
import { getAllCustomers } from "../../services/CustomerApi";
import { getRepairDetailsByOrderId } from "../../services/RepairDetailApi";
import { getAllParts } from "../../services/PartsApi";
import { getAllEmployees } from "../../services/EmployeeApi";
import { XCircle } from "lucide-react";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function RepairOrderDetails({ orderId, orderIndex, onClose, refreshKey }) {
  const [order, setOrder] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [details, setDetails] = useState([]);
  const [parts, setParts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
    getAllCustomers().then(setCustomers);
    getRepairDetailsByOrderId(orderId).then(setDetails);
    getAllParts().then(setParts);
    getAllEmployees().then(setEmployees);
  }, [orderId, refreshKey]);

  const fetchOrder = async () => {
    try {
      const data = await getRepairOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message || "Không lấy được dữ liệu");
    }
  };

  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || id;
  const getEmployeeName = (id) => employees.find(e => e.id === id)?.name || "Chưa có";
  const getPartInfo = (id) => parts.find(p => p.id === id) || {};

  const statusMap = {
    Pending: "Chờ xử lý",
    InProgress: "Đang sửa",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div className="text-gray-600 italic">Đang tải dữ liệu...</div>;

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl border border-blue-100 relative animate-fade-in overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            title="Đóng"
            type="button"
          >
            <XCircle className="w-7 h-7" />
          </button>

          <h3 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-wide drop-shadow">
            📋 Chi tiết đơn sửa chữa
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-base text-gray-800 mt-4">
            <div>
              <b className="text-blue-700">Mã đơn:</b>{" "}
              {orderIndex !== undefined
                ? `KH${String(orderIndex + 1).padStart(3, "0")}`
                : order.id}
            </div>
            <div>
              <b className="text-blue-700">Biển số xe:</b> {order.licensePlate}
            </div>
            <div>
              <b className="text-blue-700">Khách hàng:</b> {getCustomerName(order.customerId)}
            </div>
            <div>
              <b className="text-blue-700">Nhân viên sửa chữa:</b> {getEmployeeName(order.employeeId)}
            </div>
            <div>
              <b className="text-blue-700">Trạng thái:</b>{" "}
              <span className="font-semibold text-blue-600">
                {statusMap[order.status] || order.status}
              </span>
            </div>
            <div>
              <b className="text-blue-700">Ngày tạo:</b>{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div>
              <b className="text-blue-700">Mô tả:</b> {order.description || "(Không có mô tả)"}
            </div>
            <div>
              <b className="text-blue-700">Tổng tiền:</b>{" "}
              <span className="font-bold text-blue-700">
                {order.totalCost?.toLocaleString()} đ
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-bold text-blue-700 mb-3">
              🛠️ Phụ tùng thay thế
            </h4>
            {details.length === 0 ? (
              <div className="text-gray-500 italic">Không có phụ tùng thay thế.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-100 text-blue-900">
                      <th className="py-2 px-4">Tên phụ tùng</th>
                      <th className="py-2 px-4 text-center">Số lượng</th>
                      <th className="py-2 px-4 text-right">Đơn giá</th>
                      <th className="py-2 px-4 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((d, i) => {
                      const part = getPartInfo(d.partId);
                      return (
                        <tr key={d.id || i} className="hover:bg-blue-50">
                          <td className="py-2 px-4">{part.name || d.partId}</td>
                          <td className="py-2 px-4 text-center">{d.quantity}</td>
                          <td className="py-2 px-4 text-right">
                            {part.price?.toLocaleString() || 0} đ
                          </td>
                          <td className="py-2 px-4 text-right">
                            {((part.price || 0) * d.quantity).toLocaleString()} đ
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
