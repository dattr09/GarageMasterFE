import React, { useEffect, useState } from "react";
import {
  getAllRepairOrders,
  deleteRepairOrder,
} from "../../services/RepairOrderApi";
import { getAllCustomers } from "../../services/CustomerApi";
import RepairOrderAdd from "./RepairOrderAdd";
import RepairOrderEdit from "./RepairOrderEdit";
import RepairOrderDetails from "./RepairOrderDetails";
import Swal from "sweetalert2";

export default function RepairOrderList() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, [refreshKey]);

  const fetchOrders = async () => {
    try {
      const data = await getAllRepairOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) { }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : customerId;
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      await deleteRepairOrder(id);
      setRefreshKey(prev => prev + 1);
      Swal.fire("Đã xóa!", "Đơn sửa chữa đã được xóa.", "success");
    }
  };

  const handleEditSaved = () => {
    setRefreshKey(prev => prev + 1);
    // Đóng popup sửa, mở lại popup chi tiết nếu cần
  };

  // Map trạng thái sang tiếng Việt
  const statusMap = {
    Pending: "Chờ xử lý",
    InProgress: "Đang sửa",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">
        Danh sách đơn sửa chữa
      </h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm({ type: "add" })}
          className="bg-green-600 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Thêm mới
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900">
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tl-xl">
                Mã đơn
              </th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">
                Biển số xe
              </th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">
                Khách hàng
              </th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">
                Trạng thái
              </th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">
                Ngày tạo
              </th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">
                Tổng tiền
              </th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tr-xl">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-8 text-center text-gray-400 italic bg-gray-50 rounded-b-xl"
                >
                  Không có đơn sửa chữa nào.
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                    } hover:bg-blue-100`}
                >
                  <td className="py-3 px-4 text-center align-middle font-bold text-blue-700">
                    {`KH${(idx + 1).toString().padStart(3, "0")}`}
                  </td>
                  <td className="py-3 px-4 text-center align-middle font-medium">
                    {order.licensePlate}
                  </td>
                  <td className="py-3 px-4 text-center align-middle">
                    {getCustomerName(order.customerId)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-blue-600">
                      {statusMap[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}{" "}
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </td>
                  <td className="py-3 px-4 text-center text-blue-700 font-bold">
                    {order.totalCost?.toLocaleString()} đ
                  </td>
                  <td className="py-3 px-4 flex justify-center items-center gap-2 align-middle">
                    <button
                      onClick={() => {
                        setShowForm({ type: "detail", id: order.id });
                        setSelectedOrderId(order.id);
                        setSelectedOrderIndex(idx);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                      title="Chi tiết"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => setShowForm({ type: "edit", id: order.id })}
                      className="bg-yellow-400 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                      title="Sửa"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                      title="Xóa"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Popup Form */}
      {showForm && showForm.type === "add" && (
        <RepairOrderAdd
          onClose={() => setShowForm(null)}
          onSaved={() => {
            setShowForm(null);
            fetchOrders();
            setRefreshKey(prev => prev + 1); // Thêm dòng này
          }}
        />
      )}
      {showForm && showForm.type === "edit" && (
        <RepairOrderEdit
          key={`${showForm.id}-${refreshKey}`} // Remount mỗi lần sửa khác hoặc sau khi lưu
          orderId={showForm.id}
          onClose={() => setShowForm(null)}
          onSaved={() => {
            setRefreshKey(prev => prev + 1); // Trigger update + remount
            setShowForm(null);
          }}
        />
      )}
      {showForm && showForm.type === "detail" && (
        <RepairOrderDetails
          key={`${selectedOrderId}-${refreshKey}`} // Force remount để lấy lại dữ liệu mới
          orderId={selectedOrderId}
          orderIndex={selectedOrderIndex}
          onClose={() => setShowForm(null)}
          refreshKey={refreshKey}
        />
      )}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}