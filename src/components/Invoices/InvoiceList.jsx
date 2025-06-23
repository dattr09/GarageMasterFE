import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PrintInvoice from "./PrintInvoice";
import { getAllInvoices, getMyInvoices } from "../../services/InvoiceApi";
import { getAllEmployees } from "../../services/EmployeeApi";
import { getRepairOrderById } from "../../services/RepairOrderApi";
import { FileText, XCircle } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function InvoiceList() {
  const query = useQuery();
  const customerId = query.get("customerId");
  const repairOrderId = query.get("repairOrderId");
  const [invoices, setInvoices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});

  useEffect(() => {
    // Lấy danh sách hóa đơn và nhân viên khi load component
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "Admin" || user?.role === "Employee") {
      getAllInvoices().then(setInvoices).catch(console.error);
    } else if (user?.role === "Customer") {
      getMyInvoices().then(setInvoices).catch(console.error);
    }
    getAllEmployees().then(setEmployees).catch(console.error);
  }, []);

  useEffect(() => {
    // Nếu có customerId và repairOrderId trên URL thì mở popup tạo hóa đơn
    if (customerId && repairOrderId) {
      setInvoiceData({ customerId, repairOrderId, paymentMethod: "Cash" });
      setShowPrintInvoice(true);
    }
  }, [customerId, repairOrderId]);

  // Lấy tên nhân viên từ id
  const getEmployeeName = (id) => {
    if (id === undefined || id === null || id === "" || !employees.length) return "Chưa có";
    const employee = employees.find(emp => String(emp.id) === String(id));
    if (employee) {
      return employee.name || employee.fullName || `${employee.firstName || ""} ${employee.lastName || ""}`.trim();
    }
    return "Không tìm thấy";
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 mt-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center drop-shadow">
        <FileText className="inline mr-2" /> Danh sách hóa đơn
      </h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900 text-center">
              <th className="py-3 px-4 font-bold tracking-wide rounded-tl-xl whitespace-nowrap">Mã hóa đơn</th>
              <th className="py-3 px-4 font-bold tracking-wide whitespace-nowrap">Khách hàng</th>
              <th className="py-3 px-4 font-bold tracking-wide whitespace-nowrap">Ngày tạo</th>
              <th className="py-3 px-4 font-bold tracking-wide whitespace-nowrap">Thanh toán</th>
              <th className="py-3 px-4 font-bold tracking-wide whitespace-nowrap">Tổng tiền</th>
              <th className="py-3 px-4 font-bold tracking-wide rounded-tr-xl whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 italic bg-gray-50 rounded-b-xl">
                  Không có hóa đơn nào.
                </td>
              </tr>
            ) : (
              [...invoices].reverse().map((inv, idx) => (
                <tr
                  key={inv.id}
                  className={`transition text-center text-sm ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
                >
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {`HD${String(inv.id).padStart(3, "0")}`}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{inv.customerName}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {new Date(inv.checkOut).toLocaleDateString("vi-VN")}<br />
                    <span className="text-gray-500 text-xs">{new Date(inv.checkOut).toLocaleTimeString("vi-VN", { hour12: false })}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {inv.paymentMethod === "Cash" ? "Tiền mặt" : "Chuyển khoản"}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-700 whitespace-nowrap">
                    {Number(inv.totalCost).toLocaleString()} đ
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-semibold transition hover:underline"
                      onClick={() => setSelected(inv)}
                    >
                      <FileText size={16} className="inline mr-1" /> Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPrintInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <PrintInvoice
            customerId={invoiceData.customerId}
            repairOrderId={invoiceData.repairOrderId}
            paymentMethod={invoiceData.paymentMethod}
            onCreated={() => {
              // Sau khi tạo hóa đơn, reload danh sách hóa đơn
              setShowPrintInvoice(false);
              getAllInvoices().then(setInvoices).catch(console.error);
            }}
          />
        </div>
      )}

      {selected && (
        <InvoiceDetail
          invoice={selected}
          onClose={() => setSelected(null)}
          getEmployeeName={getEmployeeName}
        />
      )}
    </div>
  );
}

// Popup chi tiết hóa đơn
function InvoiceDetail({ invoice, onClose, getEmployeeName }) {
  const [repairOrder, setRepairOrder] = React.useState(null);

  React.useEffect(() => {
    // Lấy thông tin phiếu sửa chữa khi mở popup chi tiết hóa đơn
    if (invoice.repairOrderId) {
      getRepairOrderById(invoice.repairOrderId).then(setRepairOrder);
    }
  }, [invoice.repairOrderId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          <XCircle />
        </button>
        <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
          <FileText className="inline mr-1" /> Chi tiết hóa đơn
        </h3>
        <div className="space-y-2 text-sm sm:text-base w-full flex flex-col">
          <div className="flex justify-between">
            <span><b>Mã hóa đơn:</b></span>
            <span>HD{String(invoice.id).padStart(3, "0")}</span>
          </div>
          <div className="flex justify-between">
            <span><b>Khách hàng:</b></span>
            <span>{invoice.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span><b>Nhân viên sửa chữa:</b></span>
            <span>
              {repairOrder
                ? getEmployeeName(repairOrder.employeeId)
                : "Đang tải..."}
            </span>
          </div>
          <div className="flex justify-between">
            <span><b>Ngày tạo:</b></span>
            <span>
              {new Date(invoice.checkOut).toLocaleDateString("vi-VN")} {new Date(invoice.checkOut).toLocaleTimeString("vi-VN", { hour12: false })}
            </span>
          </div>
          <div className="flex justify-between">
            <span><b>Phương thức thanh toán:</b></span>
            <span>{invoice.paymentMethod === "Cash" ? "Tiền mặt" : "Chuyển khoản"}</span>
          </div>
          <div className="flex justify-between">
            <span><b>Tổng tiền:</b></span>
            <span className="font-bold text-blue-700">{Number(invoice.totalCost).toLocaleString()} đ</span>
          </div>
        </div>
        <button
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
