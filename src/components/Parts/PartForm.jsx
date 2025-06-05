import React, { useState, useEffect } from "react";
import { createPart, updatePart } from "../../services/PartsApi";

// Giả sử bạn có API lấy danh sách hãng xe
import { getAllBrands } from "../../services/BrandApi";

export default function PartForm({ part, onClose, onSaved }) {
  const [form, setForm] = useState(
    part || {
      name: "",
      quantity: "",
      price: "",
      buyPrice: "",
      empPrice: "",
      unit: "",
      limitStock: "",
      brandId: "",
    }
  );
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Lấy danh sách hãng xe từ backend
    getAllBrands().then(setBrands);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Kiểm tra brandId phải là ObjectId hợp lệ
    if (!form.brandId || !/^[a-f\d]{24}$/i.test(form.brandId)) {
      setError("Vui lòng chọn hãng xe hợp lệ!");
      return;
    }
    try {
      const data = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
        buyPrice: Number(form.buyPrice),
        empPrice: Number(form.empPrice),
        limitStock: Number(form.limitStock),
      };
      await (part ? updatePart(part.id, data) : createPart(data));
      onSaved();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl border border-blue-200">
        <h3 className="text-2xl font-bold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          {part ? "Sửa phụ tùng" : "Thêm phụ tùng"}
        </h3>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <FormInput
            label="Tên phụ tùng"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Số lượng"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Giá bán"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Giá nhập"
            name="buyPrice"
            type="number"
            value={form.buyPrice}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Giá nhân viên"
            name="empPrice"
            type="number"
            value={form.empPrice}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Đơn vị"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Tồn kho tối thiểu"
            name="limitStock"
            type="number"
            value={form.limitStock}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Hãng xe
            </label>
            <select
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Chọn hãng xe --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-6 mt-6 justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-10 py-2 rounded-xl shadow-lg transition text-lg"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-600 text-white font-semibold px-10 py-2 rounded-xl shadow-lg transition text-lg"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Component input dùng lại cho form
function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block font-semibold mb-1 text-gray-700">{label}</label>
      <input
        {...props}
        className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}