import React, { useEffect, useState } from "react";
import { getAllParts, deletePart, searchPartsByName } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import PartForm from "./PartForm";
import PartDetails from "./PartDetails";
import Swal from "sweetalert2";

export default function PartsList() {
  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]); // Thêm state này
  const [search, setSearch] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAllParts().then(setParts);
    getAllBrands().then(setBrands); // Lấy danh sách brands
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
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
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
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Thêm mới
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="py-3 px-4 text-center font-semibold">Tên</th>
              <th className="py-3 px-4 text-center font-semibold">Số lượng</th>
              <th className="py-3 px-4 text-center font-semibold">Giá bán</th>
              <th className="py-3 px-4 text-center font-semibold">Đơn vị</th>
              <th className="py-3 px-4 text-center font-semibold">Hãng</th>
              <th className="py-3 px-4 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400 italic">
                  Không có phụ tùng nào.
                </td>
              </tr>
            ) : (
              parts.map((part) => (
                <tr key={part.id} className="border-b hover:bg-blue-50 transition">
                  <td className="py-2 px-4 text-center">{part.name}</td>
                  <td className="py-2 px-4 text-center">{part.quantity}</td>
                  <td className="py-2 px-4 text-center">{part.price.toLocaleString()}₫</td>
                  <td className="py-2 px-4 text-center">{part.unit}</td>
                  <td className="py-2 px-4 text-center">{getBrandName(part.brandId)}</td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedPart(part)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded transition shadow"
                      title="Chi tiết"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => setShowForm(part)}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showForm && (
        <PartForm
          part={typeof showForm === "object" ? showForm : null}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            getAllParts().then(setParts);
            setShowForm(false);
          }}
        />
      )}
      {selectedPart && (
        <PartDetails
          part={selectedPart}
          brands={brands} // truyền thêm prop brands
          onClose={() => setSelectedPart(null)}
        />
      )}
    </div>
  );
}