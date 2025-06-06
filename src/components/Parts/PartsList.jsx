import React, { useEffect, useState } from "react";
import { getAllParts, deletePart, searchPartsByName } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import AddPartForm from "./AddPartForm";
import EditPartForm from "./EditPartForm";
import PartDetails from "./PartDetails";
import Swal from "sweetalert2";

export default function PartsList() {
  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAllParts().then(setParts);
    getAllBrands().then(setBrands);
  }, []);

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
      await deletePart(id);
      setParts(parts.filter((p) => p.id !== id));
      Swal.fire("Đã xóa!", "Phụ tùng đã được xóa.", "success");
    }
  };

  const handleSearch = async () => {
    if (search.trim() === "") {
      getAllParts().then(setParts);
    } else {
      const result = await searchPartsByName(search);
      setParts(result);
    }
  };

  // Hàm lấy tên brand từ id
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : brandId;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">Danh sách phụ tùng</h2>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Tìm
        </button>
        <button
          onClick={() => setShowForm({ type: "add" })}
          className="bg-green-600 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Thêm mới
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {parts.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 italic py-8">
            Không có phụ tùng nào.
          </div>
        ) : (
          parts.map((part) => (
            <div key={part.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center relative">
              {part.image ? (
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-24 h-24 object-contain rounded shadow mb-3"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded mb-3 text-gray-400 italic">
                  Không có ảnh
                </div>
              )}
              <div className="font-semibold text-blue-900 text-lg mb-1">{part.name}</div>
              <div className="text-gray-700 mb-1">Số lượng: <span className="font-medium">{part.quantity}</span></div>
              <div className="text-blue-700 font-bold mb-1">
                {part.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </div>
              <div className="text-gray-500 text-sm mb-1">Đơn vị: {part.unit}</div>
              <div className="text-gray-500 text-sm mb-2">Hãng: {getBrandName(part.brandId)}</div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSelectedPart(part)}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded transition shadow"
                  title="Chi tiết"
                >
                  Chi tiết
                </button>
                <button
                  onClick={() => setShowForm({ type: "edit", part })}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded transition shadow"
                  title="Sửa"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(part.id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition shadow"
                  title="Xóa"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showForm && (
        showForm.type === "add" ? (
          <AddPartForm
            onClose={() => setShowForm(false)}
            onSaved={() => {
              getAllParts().then(setParts);
              setShowForm(false);
            }}
          />
        ) : (
          <EditPartForm
            part={showForm.part}
            onClose={() => setShowForm(false)}
            onSaved={() => {
              getAllParts().then(setParts);
              setShowForm(false);
            }}
          />
        )
      )}
      {selectedPart && (
        <PartDetails
          part={selectedPart}
          brands={brands}
          onClose={() => setSelectedPart(null)}
        />
      )}
    </div>
  );
}