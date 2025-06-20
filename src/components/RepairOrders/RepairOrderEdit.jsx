import React, { useEffect, useState } from "react";
import { getRepairOrderById, updateRepairOrder } from "../../services/RepairOrderApi";
import { getAllMotos } from "../../services/MotoApi";
import { getAllCustomers } from "../../services/CustomerApi";

export default function RepairOrderEdit({ orderId, onSaved, onClose }) {
  const [form, setForm] = useState({
    customerId: "",
    licensePlate: "",
    description: "",
    status: "",
  });
  const [motos, setMotos] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
    getAllMotos().then(setMotos);
    getAllCustomers().then(setCustomers);
    // eslint-disable-next-line
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await getRepairOrderById(orderId);
      setForm({
        customerId: data.customerId,
        licensePlate: data.licensePlate,
        description: data.description,
        status: data.status,
      });
    } catch (err) {
      setError(err.message || "Không lấy được dữ liệu");
    }
  };

  const getOwnerName = (licensePlate) => {
    const moto = motos.find((m) => m.licensePlate === licensePlate);
    if (!moto) return "";
    const customer = customers.find((c) => c.id === moto.customerId);
    return customer ? customer.name : "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateRepairOrder(orderId, form);
      onSaved && onSaved();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

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
          Sửa đơn sửa chữa
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Biển số xe</label>
            <select
              name="licensePlate"
              value={form.licensePlate}
              onChange={handleChange}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            >
              <option value="">-- Chọn xe --</option>
              {motos.map((m) => (
                <option key={m.licensePlate} value={m.licensePlate}>
                  {m.licensePlate}
                </option>
              ))}
            </select>
          </div>
          {form.licensePlate && (
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Chủ xe</label>
              <input
                value={getOwnerName(form.licensePlate)}
                disabled
                className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full bg-gray-100"
              />
            </div>
          )}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
            >
              <option value="Pending">Chờ xử lý</option>
              <option value="InProgress">Đang sửa</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Hủy</option>
            </select>
          </div>
          <div className="flex gap-6 justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}