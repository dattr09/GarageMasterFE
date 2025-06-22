import React, { useState, useEffect } from "react";
import { createRepairOrder } from "../../services/RepairOrderApi";
import { getAllMotos } from "../../services/MotoApi";
import { getAllCustomers } from "../../services/CustomerApi";
import { getAllParts } from "../../services/PartsApi";
import { createRepairDetail } from "../../services/RepairDetailApi";
import { getAllEmployees } from "../../services/EmployeeApi";

import {
  Save,
  XCircle,
  Wrench,
  User,
  BadgeCheck,
  PackageSearch,
  CalendarClock,
  ClipboardList,
  Repeat,
  Hammer,
  Settings,
  Coins,
} from "lucide-react";
import Swal from "sweetalert2";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
`;

export default function RepairOrderAdd({ onSaved, onClose }) {
  const [form, setForm] = useState({
    customerId: "",
    licensePlate: "",
    model: "",
    year: "",
    description: "",
    status: "Pending",
    employeeId: "",
  });
  const [motos, setMotos] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedParts, setSelectedParts] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    getAllMotos().then(setMotos);
    getAllCustomers().then(setCustomers);
    getAllParts().then(setParts);
    getAllEmployees().then(setEmployees);
  }, []);

  useEffect(() => {
    if (form.licensePlate) {
      const moto = motos.find((m) => m.licensePlate === form.licensePlate);
      setForm((prev) => ({
        ...prev,
        model: moto?.model || "",
        year: moto?.year || "",
      }));
    }
  }, [form.licensePlate, motos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerId") {
      setForm((prev) => ({
        ...prev,
        customerId: value,
        licensePlate: "",
        model: "",
        year: "",
      }));
    } else if (name === "licensePlate") {
      const moto = motos.find((m) => m.licensePlate === value);
      setForm((prev) => ({
        ...prev,
        licensePlate: value,
        model: moto?.model || "",
        year: moto?.year || "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const selectedPartsArray = Object.entries(selectedParts)
    .filter(([_, qty]) => qty > 0)
    .map(([partId, quantity]) => ({ partId, quantity }));

  const totalCost = selectedPartsArray.reduce((sum, { partId, quantity }) => {
    const part = parts.find((p) => p.id === partId);
    return sum + (part?.price || 0) * quantity;
  }, 0);

  const filteredMotos = form.customerId
    ? motos.filter((m) => m.customerId === form.customerId)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.licensePlate) return setError("Vui lòng chọn xe!");
    const moto = motos.find((m) => m.licensePlate === form.licensePlate);
    if (!moto) return setError("Xe không hợp lệ!");
    if (selectedPartsArray.length === 0)
      return setError("Vui lòng chọn ít nhất một phụ tùng!");

    const payload = {
      customerId: moto.customerId,
      licensePlate: form.licensePlate,
      description: form.description,
      status: form.status,
      totalCost,
      employeeId: form.employeeId,
    };

    try {
      const order = await createRepairOrder(payload);
      for (const part of selectedPartsArray) {
        await createRepairDetail({
          repairOrderId: order.id,
          partId: part.partId,
          quantity: part.quantity,
        });
      }
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đơn sửa chữa đã được thêm.",
        confirmButtonColor: "#2563eb",
      });
      onSaved && onSaved();
    } catch (err) {
      setError(err.response?.data || err.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <>
      <style>{fadeInStyle}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-5xl border border-blue-100 relative animate-fade-in overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            title="Đóng"
            type="button"
          >
            <XCircle className="w-7 h-7" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-6">
            <Wrench className="text-blue-700 w-8 h-8" />
            <h3 className="text-3xl font-extrabold text-blue-700 text-center tracking-wide drop-shadow">
              Thêm đơn sửa chữa
            </h3>
          </div>

          {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Column 1 */}
              <div className="space-y-6">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Khách hàng</label>
                  <div className="relative">
                    <select
                      name="customerId"
                      value={form.customerId}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200"
                    >
                      <option value="">-- Chọn khách hàng --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {form.customerId && (
                  <>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Biển số xe</label>
                      <div className="relative">
                        <select
                          name="licensePlate"
                          value={form.licensePlate}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200"
                        >
                          <option value="">-- Chọn xe --</option>
                          {filteredMotos.map((m) => (
                            <option key={m.licensePlate} value={m.licensePlate}>{m.licensePlate}</option>
                          ))}
                        </select>
                        <BadgeCheck className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Tên xe</label>
                      <div className="relative">
                        <input
                          value={form.model}
                          disabled
                          className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 bg-gray-100"
                        />
                        <PackageSearch className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700 block mb-1">Năm sản xuất</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="year"
                          value={form.year}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200"
                        />
                        <CalendarClock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tình trạng</label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200"
                    />
                    <ClipboardList className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Trạng thái</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200"
                    >
                      <option value="Pending">Chờ xử lý</option>
                      <option value="InProgress">Đang sửa</option>
                      <option value="Completed">Hoàn thành</option>
                      <option value="Cancelled">Đã hủy</option>
                    </select>
                    <Repeat className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nhân viên sửa chữa</label>
                  <div className="relative">
                    <select
                      name="employeeId"
                      value={form.employeeId}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200"
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                    <Hammer className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-700">Phụ tùng thay thế</label>
                    <Settings className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-xl max-h-64 overflow-y-auto">
                    {parts.map((part) => (
                      <div key={part.id} className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={!!selectedParts[part.id]}
                          onChange={(e) => {
                            setSelectedParts((prev) => {
                              const copy = { ...prev };
                              if (e.target.checked) copy[part.id] = 1;
                              else delete copy[part.id];
                              return copy;
                            });
                          }}
                        />
                        <span className="w-40">
                          {part.name} ({part.price?.toLocaleString()}VNĐ)
                        </span>
                        {selectedParts[part.id] && (
                          <input
                            type="number"
                            min={1}
                            value={selectedParts[part.id]}
                            onChange={(e) => {
                              const value = Math.max(1, Number(e.target.value));
                              setSelectedParts((prev) => ({ ...prev, [part.id]: value }));
                            }}
                            className="border rounded px-2 py-1 w-20"
                            placeholder="Số lượng"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <label className="font-semibold text-lg text-gray-700 block mb-1">Tổng tiền</label>
                  <div className="relative inline-block">
                    <Coins className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      disabled
                      value={totalCost.toLocaleString() + " VNĐ"}
                      className="text-2xl font-bold text-green-600 bg-gray-100 pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow w-full"
                      style={{ maxWidth: "320px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-8">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Lưu
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold px-10 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
