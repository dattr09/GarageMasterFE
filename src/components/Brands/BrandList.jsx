import React, { useEffect, useState } from "react";
import { getAllBrands, createBrand, updateBrand, deleteBrand } from "../../services/BrandApi";
import { getAllParts } from "../../services/PartsApi";
import Swal from "sweetalert2";
import AddBrandForm from "./AddBrandForm";
import EditBrandForm from "./EditBrandForm";
import BrandDetails from "./BrandDetails";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [parts, setParts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailBrand, setDetailBrand] = useState(null);
  const [error, setError] = useState("");

  // Load danh sách brand và parts
  useEffect(() => {
    getAllBrands().then(setBrands).catch(() => setError("Không tải được danh sách hãng xe"));
    getAllParts().then(setParts);
  }, []);

  // Mở form thêm/sửa
  const openForm = (brand = null) => {
    setEditing(brand);
    setShowForm(true);
    setError("");
  };

  // Đóng form
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  // Xử lý lưu brand mới hoặc đã sửa
  const handleSaved = async () => {
    const list = await getAllBrands();
    setBrands(list);
    closeForm();
  };

  // Xóa brand với SweetAlert2
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
      // Gọi lại API để lấy danh sách mới nhất
      const list = await getAllBrands();
      setBrands(list);
      Swal.fire("Đã xóa!", "Hãng xe đã được xóa.", "success");
    }
  };

  // Hiển thị chi tiết hãng xe
  const handleShowDetail = (brand) => {
    setDetailBrand(brand);
    setShowDetail(true);
  };

  // Đóng chi tiết hãng xe
  const closeDetail = () => {
    setShowDetail(false);
    setDetailBrand(null);
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">Danh sách hãng xe</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => openForm()}
            className="bg-green-600 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            Thêm mới
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900">
                <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tl-xl">Tên hãng xe</th>
                {/* <th className="py-3 px-4 text-center font-bold text-base tracking-wide">ID</th> */}
                <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tr-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-gray-400 italic bg-gray-50 rounded-b-xl">
                    Không có hãng xe nào.
                  </td>
                </tr>
              ) : (
                brands.map((brand, idx) => (
                  <tr
                    key={brand.id}
                    className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
                  >
                    <td className="py-3 px-4 text-center align-middle font-medium">{brand.name}</td>
                    {/* <td className="py-3 px-4 text-center align-middle font-mono text-xs text-gray-500">{brand.id}</td> */}
                    <td className="py-3 px-4 flex justify-center items-center gap-2 align-middle">
                      <button
                        onClick={() => handleShowDetail(brand)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                        title="Chi tiết"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => openForm(brand)}
                        className="bg-yellow-400 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                        title="Sửa"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
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
        {/* Popup Form */}
        {showForm && (
          editing ? (
            <EditBrandForm
              brand={editing}
              onClose={closeForm}
              onSaved={handleSaved}
            />
          ) : (
            <AddBrandForm
              onClose={closeForm}
              onSaved={handleSaved}
            />
          )
        )}
        {/* Popup Chi tiết */}
        {showDetail && detailBrand && (
          <BrandDetails
            brand={detailBrand}
            parts={parts.filter((p) => p.brandId === detailBrand.id)}
            onClose={closeDetail}
          />
        )}
      </div>
    </div>
  );
}