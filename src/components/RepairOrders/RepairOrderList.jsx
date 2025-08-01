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
import { PlusCircle, Pencil, Trash2, Info } from "lucide-react";

export default function RepairOrderList() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    // Lấy role từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.role || "");
  }, [refreshKey]);

  // Lấy danh sách đơn sửa chữa
  const fetchOrders = async () => {
    try {
      const data = await getAllRepairOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Lấy danh sách khách hàng
  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {}
  };

  // Lấy tên khách hàng từ id
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : customerId;
  };

  // Lọc theo tên khách hàng hoặc biển số xe
  const filteredOrders = orders.filter((order) => {
    const customerName = getCustomerName(order.customerId);
    return (
      order.licensePlate?.toLowerCase().includes(search.toLowerCase()) ||
      customerName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Xử lý xóa đơn sửa chữa
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
      setRefreshKey((prev) => prev + 1);
      Swal.fire("Đã xóa!", "Đơn sửa chữa đã được xóa.", "success");
    }
  };

  const statusMap = {
    Pending: "Chờ xử lý",
    InProgress: "Đang sửa",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  // Kiểm tra quyền admin hoặc employee
  // const canEdit = userRole === "Admin" || userRole === "Employee";

  return (
    <div className="max-w-full mx-auto bg-white rounded-xl shadow-xl p-6 mt-6 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6 drop-shadow-md">
        🛠️ Danh sách đơn sửa chữa
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <input
          type="text"
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Tìm theo tên khách hoặc biển số xe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* {canEdit && ( */}
        <button
          onClick={() => setShowForm({ type: "add" })}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white font-bold px-4 py-2 rounded-xl transition shadow"
        >
          <PlusCircle size={20} /> Thêm mới
        </button>
        {/* )} */}
      </div>

      <div className="rounded-xl border border-gray-200 shadow overflow-x-auto w-full">
        <table className="w-full min-w-[900px] divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-4 py-3 text-center font-semibold">Mã đơn</th>
              <th className="px-4 py-3 text-center font-semibold">
                Biển số xe
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-center font-semibold">Ngày tạo</th>
              <th className="px-4 py-3 text-center font-semibold">Tổng tiền</th>
              <th className="px-4 py-3 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-400 italic"
                >
                  Không có đơn sửa chữa nào.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-blue-100`}
                >
                  <td className="px-4 py-3 text-center font-bold text-blue-700 whitespace-nowrap">
                    {`KH${(idx + 1).toString().padStart(3, "0")}`}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {order.licensePlate}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {getCustomerName(order.customerId)}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600 whitespace-nowrap">
                    {statusMap[order.status] || order.status}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}{" "}
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center text-blue-700 font-bold">
                    {order.totalCost?.toLocaleString()} VNĐ
                  </td>
                  <td className="px-4 py-3 flex flex-nowrap justify-center gap-2">
                    <button
                      onClick={() => {
                        setShowForm({ type: "detail", id: order.id });
                        setSelectedOrderId(order.id);
                        setSelectedOrderIndex(idx);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition whitespace-nowrap"
                      title="Chi tiết"
                    >
                      <Info size={16} /> Chi tiết
                    </button>
                    {/* {canEdit && ( */}
                    <>
                      <button
                        onClick={() =>
                          setShowForm({ type: "edit", id: order.id })
                        }
                        className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow font-semibold transition whitespace-nowrap"
                        title="Sửa"
                      >
                        <Pencil size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition whitespace-nowrap"
                        title="Xóa"
                      >
                        <Trash2 size={16} /> Xóa
                      </button>
                      {(order.status === "Completed" ||
                        order.status === "Hoàn thành") && (
                        <button
                          className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded-lg shadow font-semibold transition whitespace-nowrap"
                          onClick={() =>
                            (window.location.href = `/invoices?customerId=${order.customerId}&repairOrderId=${order.id}`)
                          }
                        >
                          Tạo hóa đơn
                        </button>
                      )}
                      {order.status !== "Completed" &&
                        order.status !== "Hoàn thành" && (
                          <span className="text-gray-400 italic whitespace-nowrap">
                            Chưa hoàn thành
                          </span>
                        )}
                    </>
                    {/* )} */}
                    {/* {!canEdit && ( */}
                    <span className="text-gray-400 italic whitespace-nowrap">
                      {order.status === "Completed" ||
                      order.status === "Hoàn thành"
                        ? "Chỉ Admin/Employee được tạo hóa đơn"
                        : "Chưa hoàn thành"}
                    </span>
                    {/* )} */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form thêm/sửa/chi tiết */}
      {showForm?.type === "add" && (
        <RepairOrderAdd
          onClose={() => setShowForm(null)}
          onSaved={() => {
            setShowForm(null);
            setRefreshKey((prev) => prev + 1);
          }}
        />
      )}
      {showForm?.type === "edit" && (
        <RepairOrderEdit
          key={`${showForm.id}-${refreshKey}`}
          orderId={showForm.id}
          onClose={() => setShowForm(null)}
          onSaved={() => {
            setRefreshKey((prev) => prev + 1);
            setShowForm(null);
          }}
        />
      )}
      {showForm?.type === "detail" && (
        <RepairOrderDetails
          key={`${selectedOrderId}-${refreshKey}`}
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
