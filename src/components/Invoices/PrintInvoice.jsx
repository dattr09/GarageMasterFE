import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

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

  useEffect(() => {
    setSelectedCustomer(customerId || "");
  }, [customerId]);
  useEffect(() => {
    setSelectedOrder(repairOrderId || "");
  }, [repairOrderId]);
  useEffect(() => {
    setSelectedPayment(paymentMethod || "Cash");
  }, [paymentMethod]);

  // Lấy danh sách khách hàng
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5119/api/customers", {
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    })
      .then(res => {
        if (res.status === 204) return null;
        if (!res.ok) throw new Error("Không lấy được danh sách khách hàng");
        return res.json();
      })
      .then(setCustomers)
      .catch(console.error);
  }, []);

  // Lấy danh sách phiếu sửa của khách đã chọn
  useEffect(() => {
    if (selectedCustomer) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:5119/api/repairorders?customerId=${selectedCustomer}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      })
        .then(res => {
          if (res.status === 204 || res.status === 404) return [];
          if (!res.ok) throw new Error("Không lấy được danh sách phiếu sửa");
          return res.json();
        })
        .then(data => setRepairOrders((data || []).filter(o => o.status === "Completed")))
        .catch(console.error);
    } else {
      setRepairOrders([]);
    }
  }, [selectedCustomer]);

  // Lấy danh sách nhân viên
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5119/api/employees", {
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    })
      .then(res => {
        if (!res.ok) throw new Error("Không lấy được danh sách nhân viên");
        return res.json();
      })
      .then(setEmployees)
      .catch(console.error);
  }, []);

  // Tạo hóa đơn khi chọn đủ thông tin
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
    console.log("Dữ liệu gửi lên:", body);

    try {
      const res = await fetch("http://localhost:5119/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
        if (props.onCreated) props.onCreated(data); // <-- Đảm bảo dòng này có
      } else {
        const err = await res.text();
        console.error("Lỗi tạo hóa đơn:", err);
        alert("Tạo hóa đơn thất bại!\n" + err);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không kết nối được tới server!");
    }
  };

  // In hóa đơn
  const handlePrint = () => {
    if (!invoice) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`<html><head><title>In hóa đơn</title></head><body>${printContents}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const getEmployeeName = (id) => {
    if (!id || !employees.length) return "Chưa có";
    const emp = employees.find(e => String(e.id) === String(id));
    if (!emp) return "Không tìm thấy";
    if (emp.name) return emp.name;
    if (emp.fullName) return emp.fullName;
    return `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 relative">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
        onClick={() => props.onCreated && props.onCreated()}
        title="Đóng"
        type="button"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">Tạo/In hóa đơn</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Chọn khách hàng</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
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
          <label className="block font-semibold mb-1">Chọn phiếu sửa chữa</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={selectedOrder}
            onChange={e => {
              setSelectedOrder(e.target.value);
              setInvoice(null);
            }}
            disabled={!selectedCustomer}
          >
            <option value="">-- Chọn phiếu sửa --</option>
            {repairOrders.map(o => (
              <option key={o.id} value={o.id}>
                {o.id} - {o.description} ({o.status})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Hình thức thanh toán</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={selectedPayment}
            onChange={e => setSelectedPayment(e.target.value)}
          >
            <option value="Cash">Tiền mặt</option>
            <option value="BankTransfer">Chuyển khoản</option>
          </select>
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-800 text-white px-8 py-2 rounded-lg font-bold shadow transition"
          onClick={handleCreateInvoice}
          disabled={!selectedCustomer || !selectedOrder}
        >
          Tạo hóa đơn
        </button>
      </div>
      {invoice && (
        <div className="mt-8 border-t pt-6" ref={printRef}>
          <h3 className="text-xl font-bold text-blue-700 mb-2 text-center">HÓA ĐƠN THANH TOÁN</h3>
          <div className="mb-2"><b>Mã hóa đơn:</b> {`HD${String(invoice.id).padStart(4, "0")}`}</div>
          <div className="mb-2"><b>Khách hàng:</b> {invoice.customerName}</div>
          <div className="mb-2"><b>Nhân viên sửa chữa:</b> {getEmployeeName(invoice.employeeId)}</div> {/* Thêm dòng này */}
          <div className="mb-2"><b>Ngày tạo:</b> {new Date(invoice.checkOut).toLocaleString("vi-VN")}</div>
          <div className="mb-2"><b>Phương thức thanh toán:</b> {invoice.paymentMethod === "Cash" ? "Tiền mặt" : "Chuyển khoản"}</div>
          <div className="mb-2"><b>Tổng tiền:</b> <span className="font-bold text-blue-700">{Number(invoice.totalCost).toLocaleString()} đ</span></div>
          <button
            className="mt-4 bg-green-600 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-bold shadow transition w-full"
            onClick={handlePrint}
          >
            In hóa đơn
          </button>
        </div>
      )}
    </div>
  );
}