import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PrintInvoice from "./PrintInvoice";
import { getAllInvoices } from "../../services/InvoiceApi";
import { getAllEmployees } from "../../services/EmployeeApi";

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
    getAllInvoices().then(setInvoices).catch(console.error);
    getAllEmployees().then(setEmployees).catch(console.error);
  }, []);

  useEffect(() => {
    if (customerId && repairOrderId) {
      setInvoiceData({
        customerId,
        repairOrderId,
        paymentMethod: "Cash"
      });
      setShowPrintInvoice(true);
    }
  }, [customerId, repairOrderId]);

  const getEmployeeName = (id) => {
    if (!id || !employees.length) return "Chưa có";
    const employee = employees.find(emp => String(emp.id) === String(id));
    if (employee) {
      if (employee.name) return employee.name;
      if (employee.fullName) return employee.fullName;
      if (employee.firstName || employee.lastName)
        return `${employee.firstName || ""} ${employee.lastName || ""}`.trim();
      return employee.id;
    }
    return "Không tìm thấy";
  };

  if (selected) {
    return (
      <InvoiceDetail
        invoice={selected}
        onClose={() => setSelected(null)}
        getEmployeeName={getEmployeeName}
        employees={employees} // truyền thêm nếu cần debug
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">Danh sách hóa đơn</h2>
      <div className="flex justify-end mb-4">
        <button
          className="bg-purple-600 hover:bg-purple-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          onClick={() => {
            setInvoiceData({
              customerId: "",
              repairOrderId: "",
              paymentMethod: "Cash"
            });
            setShowPrintInvoice(true);
          }}
        >
          Tạo/In hóa đơn
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900">
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tl-xl">Mã hóa đơn</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">Khách hàng</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">Ngày tạo</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">Thanh toán</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">Tổng tiền</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tr-xl"></th>
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
                  className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
                >
                  <td className="py-3 px-4 text-center align-middle font-medium">
                    {`HD${String(inv.id).padStart(4, "0")}`}
                  </td>
                  <td className="py-3 px-4 text-center">{inv.customerName}</td>
                  <td className="py-3 px-4 text-center">
                    {new Date(inv.checkOut).toLocaleDateString("vi-VN")}<br />
                    {new Date(inv.checkOut).toLocaleTimeString("vi-VN", { hour12: false })}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {inv.paymentMethod === "Cash" ? "Tiền mặt" : "Chuyển khoản"}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-700">
                    {Number(inv.totalCost).toLocaleString()} đ
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      className="text-blue-600 hover:underline font-semibold"
                      onClick={() => setSelected(inv)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Popup giao diện in hóa đơn */}
      {showPrintInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <PrintInvoice
            customerId={invoiceData.customerId}
            repairOrderId={invoiceData.repairOrderId}
            paymentMethod={invoiceData.paymentMethod}
            onCreated={() => {
              setShowPrintInvoice(false);
              getAllInvoices().then(setInvoices).catch(console.error);
            }}
          />
        </div>
      )}
    </div>
  );
}

function InvoiceDetail({ invoice, onClose, getEmployeeName }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">Chi tiết hóa đơn</h3>
        <div className="mb-2"><b>Mã hóa đơn:</b> {invoice.id}</div>
        <div className="mb-2"><b>Khách hàng:</b> {invoice.customerName}</div>
        <div className="mb-2"><b>Nhân viên sửa chữa:</b> {getEmployeeName(invoice.employeeId)}</div>
        <div className="mb-2"><b>Ngày tạo:</b> {new Date(invoice.checkOut).toLocaleDateString("vi-VN")} {new Date(invoice.checkOut).toLocaleTimeString("vi-VN", { hour12: false })}</div>
        <div className="mb-2"><b>Phương thức thanh toán:</b> {invoice.paymentMethod === "Cash" ? "Tiền mặt" : "Chuyển khoản"}</div>
        <div className="mb-2"><b>Tổng tiền:</b> <span className="font-bold text-blue-700">{Number(invoice.totalCost).toLocaleString()} đ</span></div>
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-bold shadow transition w-full"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}