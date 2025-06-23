import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";
import { getAllInvoices } from "../../services/InvoiceApi";
import { getAllOrders } from "../../services/OrderApi";

// Gom nhóm mảng theo key
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}
// Tính tổng giá trị theo hàm truyền vào
function sum(arr, fn) {
  return arr.reduce((acc, item) => acc + fn(item), 0);
}

const COLORS = ["#3b82f6", "#10b981"];

export default function RevenueStats() {
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [viewMode, setViewMode] = useState("bar");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [quarterFilter, setQuarterFilter] = useState("All");

  useEffect(() => {
    // Lấy danh sách hóa đơn và đơn hàng khi load component
    getAllInvoices().then(setInvoices).catch(console.error);
    getAllOrders().then(setOrders).catch(console.error);
  }, []);

  const paidInvoices = invoices.filter((inv) => inv.status !== "Canceled");
  const paidOrders = orders;

  // Chuẩn hóa dữ liệu đơn hàng
  const mappedOrders = paidOrders.map((order) => ({
    checkOut: order.createdAt || order.checkOut,
    totalCost: order.total || order.totalCost,
    type: "order",
  }));

  // Chuẩn hóa dữ liệu hóa đơn
  const mappedInvoices = paidInvoices.map((inv) => ({
    checkOut: inv.checkOut,
    totalCost: inv.totalCost,
    type: "invoice",
  }));

  const allData = [...mappedInvoices, ...mappedOrders];

  // Lấy danh sách các năm có trong dữ liệu
  const years = Array.from(new Set(allData.map((item) => new Date(item.checkOut).getFullYear()))).sort();

  // Chuẩn bị 12 tháng trong năm được chọn
  const monthLabels = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    return {
      key: `${selectedYear}-${month}`,
      label: `Tháng ${month}/${selectedYear}`,
      invoice: 0,
      order: 0,
      monthIndex: i + 1,
    };
  });

  // Gom nhóm dữ liệu theo tháng
  const byMonth = groupBy(allData, (item) => {
    const d = new Date(item.checkOut);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // Tính tổng hóa đơn và đơn hàng theo tháng
  const stats = monthLabels.map((m) => {
    const items = byMonth[m.key] || [];
    const invoiceTotal = sum(items.filter((i) => i.type === "invoice"), (i) => Number(i.totalCost));
    const orderTotal = sum(items.filter((i) => i.type === "order"), (i) => Number(i.totalCost));
    return { ...m, invoice: invoiceTotal, order: orderTotal };
  });

  const quarterMap = {
    Q1: [1, 2, 3],
    Q2: [4, 5, 6],
    Q3: [7, 8, 9],
    Q4: [10, 11, 12],
  };

  // Lọc dữ liệu theo quý nếu có chọn
  const filteredStats =
    quarterFilter === "All"
      ? stats
      : stats.filter((m) => quarterMap[quarterFilter].includes(m.monthIndex));

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthStats = stats.find((m) => m.key === currentMonthKey) || { invoice: 0, order: 0 };
  const currentMonthTotal = currentMonthStats.invoice + currentMonthStats.order;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-6 md:p-10 border border-blue-200">
        <h2 className="text-4xl font-bold text-blue-800 mb-4 text-center drop-shadow-md">
          📊 Thống kê doanh thu
        </h2>

        <div className="text-center mb-6 text-xl text-blue-700 font-semibold">
          Doanh thu tháng {now.getMonth() + 1}/{now.getFullYear()}:{" "}
          <span className="text-green-600">{currentMonthTotal.toLocaleString()} VNĐ</span>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6">
          <div className="flex gap-2">
            {["bar", "table", "pie"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium 
                  ${viewMode === mode ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
              >
                {mode === "bar" ? "Biểu đồ cột" : mode === "table" ? "Dạng bảng" : "Biểu đồ tròn"}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <select
              className="border rounded-lg p-2 shadow-sm text-sm text-gray-700"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>

            <select
              className="border rounded-lg p-2 shadow-sm text-sm text-gray-700"
              value={quarterFilter}
              onChange={(e) => setQuarterFilter(e.target.value)}
            >
              <option value="All">Cả năm</option>
              <option value="Q1">Quý I</option>
              <option value="Q2">Quý II</option>
              <option value="Q3">Quý III</option>
              <option value="Q4">Quý IV</option>
            </select>
          </div>
        </div>

        {viewMode === "bar" && (
          <div className="overflow-x-auto rounded-xl ring-1 ring-blue-200 shadow-inner bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="min-w-[950px] h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredStats}
                  margin={{ top: 20, right: 30, left: 60, bottom: 50 }}
                  barCategoryGap="20%"
                >
                  <defs>
                    <linearGradient id="colorInvoice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="label" angle={-15} textAnchor="end" height={80} interval={0} />
                  <YAxis tickFormatter={(v) => v.toLocaleString()} />
                  <Tooltip formatter={(v) => v.toLocaleString() + " VNĐ"} />
                  <Legend verticalAlign="top" iconType="circle" />
                  <Bar dataKey="invoice" name="Hóa Đơn" fill="url(#colorInvoice)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="order" name="Đơn Hàng" fill="url(#colorOrder)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === "table" && (
          <div className="overflow-x-auto mt-4 rounded-xl border border-blue-200 shadow-sm">
            <table className="min-w-full text-sm text-left bg-white rounded-xl">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="p-3">Tháng</th>
                  <th className="p-3">Tổng hóa đơn</th>
                  <th className="p-3">Tổng đơn hàng</th>
                  <th className="p-3">Tổng doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map((m, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{m.label}</td>
                    <td className="p-3 text-blue-600">{m.invoice.toLocaleString()} VNĐ</td>
                    <td className="p-3 text-green-600">{m.order.toLocaleString()} VNĐ</td>
                    <td className="p-3 font-semibold">{(m.invoice + m.order).toLocaleString()} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === "pie" && (
          <div className="w-full md:w-[500px] mx-auto mt-8">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Tooltip formatter={(v) => v.toLocaleString() + " VNĐ"} />
                <Legend verticalAlign="bottom" />
                <Pie
                  data={[
                    { name: "Tổng Hóa Đơn", value: sum(filteredStats, (i) => i.invoice) },
                    { name: "Tổng Đơn Hàng", value: sum(filteredStats, (i) => i.order) },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={130}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
