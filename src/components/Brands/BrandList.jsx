import React, { useEffect, useState } from "react";
import { getAllBrands, deleteBrand } from "../../services/BrandApi";
import { getAllParts } from "../../services/PartsApi";
import Swal from "sweetalert2";
import AddBrandForm from "./AddBrandForm";
import EditBrandForm from "./EditBrandForm";
import BrandDetails from "./BrandDetails";
import { PlusCircle, Pencil, Trash2, Info } from "lucide-react";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [parts, setParts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailBrand, setDetailBrand] = useState(null);

  useEffect(() => {
    getAllBrands().then(setBrands).catch(() => { });
    getAllParts().then(setParts);
  }, []);

  const openForm = (brand = null) => {
    setEditing(brand);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSaved = async () => {
    const list = await getAllBrands();
    setBrands(list);
    closeForm();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa hãng xe này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      await deleteBrand(id);
      const list = await getAllBrands();
      setBrands(list);
      Swal.fire("Đã xóa!", "Hãng xe đã được xóa.", "success");
    }
  };

  const handleShowDetail = (brand) => {
    setDetailBrand(brand);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setDetailBrand(null);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-6 mt-6 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6 drop-shadow-md">
          🏍️ Danh sách hãng xe
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
          <span className="text-gray-600 text-sm italic">Tổng có {brands.length} hãng xe</span>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white font-bold px-4 py-2 rounded-xl transition shadow"
          >
            <PlusCircle size={20} /> Thêm mới
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="px-6 py-3 text-center font-semibold">Tên hãng xe</th>
                <th className="px-6 py-3 text-center font-semibold">Ảnh</th>
                <th className="px-6 py-3 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400 italic">
                    Không có hãng xe nào.
                  </td>
                </tr>
              ) : (
                brands.map((brand, idx) => (
                  <tr
                    key={brand.id}
                    className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                      } hover:bg-blue-100`}
                  >
                    <td className="px-6 py-4 text-center font-medium">{brand.name}</td>
                    <td className="px-6 py-4 text-center">
                      {brand.image ? (
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="h-10 w-10 object-contain mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400 italic">Không có ảnh</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleShowDetail(brand)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                        title="Chi tiết"
                      >
                        <Info size={16} /> Chi tiết
                      </button>
                      <button
                        onClick={() => openForm(brand)}
                        className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                        title="Sửa"
                      >
                        <Pencil size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                        title="Xóa"
                      >
                        <Trash2 size={16} /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Form Thêm/Sửa */}
        {showForm &&
          (editing ? (
            <EditBrandForm brand={editing} onClose={closeForm} onSaved={handleSaved} />
          ) : (
            <AddBrandForm onClose={closeForm} onSaved={handleSaved} />
          ))}

        {/* Chi tiết hãng */}
        {showDetail && detailBrand && (
          <BrandDetails
            brand={detailBrand}
            parts={parts.filter((p) => p.brandId === detailBrand.id)}
            onClose={closeDetail}
          />
        )}
      </div>
    </>
  );
}
