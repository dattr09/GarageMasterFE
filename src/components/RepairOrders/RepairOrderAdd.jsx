import React, { useState, useEffect } from "react";
import { createRepairOrder } from "../../services/RepairOrderApi";
import { getAllMotos } from "../../services/MotoApi";
import { getAllCustomers } from "../../services/CustomerApi";
import { getAllParts } from "../../services/PartsApi";
import { createRepairDetail } from "../../services/RepairDetailApi";

export default function RepairOrderAdd({ onSaved, onClose }) {
  const [form, setForm] = useState({
    customerId: "",
    licensePlate: "",
    model: "",
    year: "",
    description: "",
    status: "Pending",
  });
  const [motos, setMotos] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    getAllMotos().then(setMotos);
    getAllCustomers().then(setCustomers);
    getAllParts().then(setParts);
  }, []);

  // Đồng bộ model và year khi licensePlate thay đổi
  useEffect(() => {
    if (form.licensePlate) {
      const moto = motos.find((m) => m.licensePlate === form.licensePlate);
      setForm((prev) => ({
        ...prev,
        model: moto ? moto.model : "",
        year: moto ? moto.year : "",
      }));
    }
  }, [form.licensePlate, motos]);

  const getOwnerName = (licensePlate) => {
    const moto = motos.find((m) => m.licensePlate === licensePlate);
    if (!moto) return "";
    const customer = customers.find((c) => c.id === moto.customerId);
    return customer ? customer.name : "";
  };

  const getMotoInfo = (licensePlate) => {
    const moto = motos.find((m) => m.licensePlate === licensePlate);
    return moto ? { model: moto.model, year: moto.year } : { model: "", year: "" };
  };

  // Khi chọn khách hàng, reset biển số xe và model
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
        model: moto ? moto.model : "",
        year: moto ? moto.year : "",
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.licensePlate) {
      setError("Vui lòng chọn xe!");
      return;
    }
    const moto = motos.find((m) => m.licensePlate === form.licensePlate);
    if (!moto) {
      setError("Xe không hợp lệ!");
      return;
    }
    const selectedPartsArray = Object.entries(selectedParts)
      .filter(([partId, quantity]) => partId && quantity > 0)
      .map(([partId, quantity]) => ({
        partId,
        quantity,
      }));
    if (selectedPartsArray.length === 0) {
      setError("Vui lòng chọn ít nhất một phụ tùng!");
      return;
    }

    // Chỉ gửi đúng trường backend yêu cầu
    const payload = {
      customerId: moto.customerId,
      licensePlate: form.licensePlate,
      description: form.description,
      status: form.status,
      totalCost,
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
      onSaved && onSaved();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError(err.message || "Có lỗi xảy ra!");
      }
    }
  };

  const selectedPartsArray = Object.entries(selectedParts)
    .filter(([partId, quantity]) => partId && quantity > 0)
    .map(([partId, quantity]) => ({
      partId,
      quantity,
    }));

  const totalCost = selectedPartsArray.reduce((sum, item) => {
    const part = parts.find((p) => p.id === item.partId);
    return sum + (part ? part.price * item.quantity : 0);
  }, 0);

  // Lọc danh sách xe theo khách hàng đã chọn
  const filteredMotos = form.customerId
    ? motos.filter((m) => m.customerId === form.customerId)
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-4xl border border-blue-100 relative overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          ×
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Thêm đơn sửa chữa
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Chọn khách hàng */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Khách hàng</label>
                <select
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
                  required
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Chọn biển số xe */}
              {form.customerId && (
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Biển số xe</label>
                  <select
                    name="licensePlate"
                    value={form.licensePlate}
                    onChange={handleChange}
                    className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
                    required
                  >
                    <option value="">-- Chọn xe --</option>
                    {filteredMotos.map((m) => (
                      <option key={m.licensePlate} value={m.licensePlate}>
                        {m.licensePlate}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Hiển thị tên xe */}
              {form.licensePlate && (
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Tên xe</label>
                  <input
                    value={form.model || ""}
                    disabled
                    className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full bg-gray-100"
                  />
                </div>
              )}
              {/* Năm sản xuất */}
              {form.licensePlate && (
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Năm sản xuất</label>
                  <input
                    name="year"
                    type="number"
                    value={form.year || ""}
                    onChange={handleChange}
                    className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
                    placeholder="Nhập năm sản xuất"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Tình trạng</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
                />
              </div>
            </div>
            <div className="space-y-6 flex flex-col">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Phụ tùng thay thế</label>
                <div className="max-h-64 overflow-y-auto border rounded-xl p-2 bg-gray-50">
                  {parts.map((part) => (
                    <div key={part.id} className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={!!selectedParts[part.id]}
                        onChange={e => {
                          setSelectedParts(prev => {
                            const copy = { ...prev };
                            if (e.target.checked) {
                              copy[part.id] = 1;
                            } else {
                              delete copy[part.id];
                            }
                            return copy;
                          });
                        }}
                      />
                      <span className="w-40">{part.name} ({part.price?.toLocaleString()}đ)</span>
                      {selectedParts[part.id] && (
                        <input
                          type="number"
                          min={1}
                          value={selectedParts[part.id]}
                          onChange={e => {
                            const value = Math.max(1, Number(e.target.value));
                            setSelectedParts(prev => ({ ...prev, [part.id]: value }));
                          }}
                          className="border rounded px-2 py-1 w-20"
                          placeholder="Số lượng"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full"
                  required
                >
                  <option value="Pending">Chờ xử lý</option>
                  <option value="InProgress">Đang sửa</option>
                  <option value="Completed">Hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Tổng tiền</label>
                <input
                  value={totalCost.toLocaleString() + " đ"}
                  disabled
                  className="border-2 border-gray-200 rounded-xl px-4 py-2 w-full bg-gray-100 font-bold text-blue-700"
                />
              </div>
            </div>
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