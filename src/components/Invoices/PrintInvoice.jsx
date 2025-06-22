import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  User,
  ClipboardList,
  CreditCard,
  Printer,
  XCircle,
  DollarSign,
} from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PrintInvoice(props) {
  const query = useQuery();
  const customerId = props.customerId || query.get("customerId") || "";
  const repairOrderId = props.repairOrderId || query.get("repairOrderId") || "";
  const paymentMethod = props.paymentMethod || "Cash";
  const [customers, setCustomers] = useState([]);
  const [repairOrders, setRepairOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(customerId);
  const [selectedOrder, setSelectedOrder] = useState(repairOrderId);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethod);
  const [invoice, setInvoice] = useState(null);
  const printRef = useRef();

  useEffect(() => setSelectedCustomer(customerId || ""), [customerId]);
  useEffect(() => setSelectedOrder(repairOrderId || ""), [repairOrderId]);
  useEffect(() => setSelectedPayment(paymentMethod || "Cash"), [paymentMethod]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5119/api/customers", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => (res.status === 204 ? null : res.json()))
      .then(setCustomers)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:5119/api/repairorders?customerId=${selectedCustomer}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(res => (res.status >= 400 ? [] : res.json()))
        .then(data => setRepairOrders((data || []).filter(o => o.status === "Completed")))
        .catch(console.error);
    } else {
      setRepairOrders([]);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5119/api/employees", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(setEmployees)
      .catch(console.error);
  }, []);

  const handleCreateInvoice = async () => {
    if (!selectedCustomer || !selectedOrder) {
      alert("Bạn phải chọn khách hàng và phiếu sửa chữa!");
      return;
    }
    const token = localStorage.getItem("token");
    const body = {
      customerId: selectedCustomer,
      repairOrderId: selectedOrder,
      paymentMethod: selectedPayment,
    };
    try {
      const res = await fetch("http://localhost:5119/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
        if (props.onCreated) props.onCreated(data);
      } else {
        const err = await res.text();
        alert("Tạo hóa đơn thất bại!\n" + err);
      }
    } catch (error) {
      alert("Không kết nối được tới server!");
    }
  };

  const handlePrint = () => {
    if (!invoice) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`<html><head><title>In hóa đơn</title></head><body>${printContents}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => String(e.id) === String(id));
    return emp?.name || emp?.fullName || `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim() || "Không tìm thấy";
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-8 relative animate-fade-in">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition text-2xl"
        onClick={() => props.onCreated?.()}
        title="Đóng"
      >
        <XCircle />
      </button>
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">
        <ClipboardList className="inline mr-2" /> Tạo/In hóa đơn
      </h2>

      <div className="space-y-4 text-sm sm:text-base">
        <div>
          <label className="font-semibold flex items-center gap-2 mb-1">
            <User size={18} /> Chọn khách hàng
          </label>
          <select
            className="w-full border rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-300"
            value={selectedCustomer}
            onChange={e => {
              setSelectedCustomer(e.target.value);
              setSelectedOrder("");
              setInvoice(null);
            }}
          >
            <option value="">-- Chọn khách hàng --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold flex items-center gap-2 mb-1">
            <CreditCard size={18} /> Hình thức thanh toán
          </label>
          <select
            className="w-full border rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-300"
            value={selectedPayment}
            onChange={e => setSelectedPayment(e.target.value)}
          >
            <option value="Cash">Tiền mặt</option>
            <option value="BankTransfer">Chuyển khoản</option>
          </select>
        </div>

        <button
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-2 rounded-xl font-bold shadow-md transition"
          onClick={handleCreateInvoice}
          disabled={!selectedCustomer || !selectedOrder}
        >
          <DollarSign className="inline mr-1" size={18} /> Tạo hóa đơn
        </button>
      </div>

      {invoice && (
        <div className="mt-8 border-t pt-6" ref={printRef}>
          <h3 className="text-xl font-bold text-blue-700 text-center mb-4">
            HÓA ĐƠN THANH TOÁN
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm sm:text-base whitespace-nowrap">
            <div><b>Mã hóa đơn:</b> HD{String(invoice.id).padStart(3, "0")}</div>
            <div><b>Khách hàng:</b> {invoice.customerName}</div>
            <div><b>Nhân viên sửa chữa:</b> {getEmployeeName(invoice.employeeId)}</div>
            <div><b>Ngày tạo:</b> {new Date(invoice.checkOut).toLocaleString("vi-VN")}</div>
            <div><b>Phương thức thanh toán:</b> {invoice.paymentMethod === "Cash" ? "Tiền mặt" : "Chuyển khoản"}</div>
            <div>
              <b>Tổng tiền:</b> <span className="font-bold text-blue-700">{Number(invoice.totalCost).toLocaleString()} đ</span>
            </div>
          </div>
          <button
            className="mt-6 w-full bg-green-600 hover:bg-green-800 text-white px-6 py-2 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2"
            onClick={handlePrint}
          >
            <Printer size={18} /> In hóa đơn
          </button>
        </div>
      )}
    </div>
  );
}
