import React, { useEffect, useState } from "react";
import { getAllMotos, deleteMoto } from "../../services/MotoApi";
import { getAllBrands } from "../../services/BrandApi";
import { getAllCustomers } from "../../services/CustomerApi";
import Swal from "sweetalert2";
import AddMotoForm from "./AddMotoForm";
import EditMotoForm from "./EditMotoForm";
import MotoDetails from "./MotoDetails";
import {
  Eye,
  Pencil,
  Trash2,
  PlusCircle,
  Info,
} from "lucide-react";

export default function MotoList() {
  const [motos, setMotos] = useState([]);
  const [brands, setBrands] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailMoto, setDetailMoto] = useState(null);
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchData();
    // Lấy role từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.role || "");
  }, []);

  const fetchData = async () => {
    try {
      const [motosData, brandsData, customersData] = await Promise.all([
        getAllMotos(),
        getAllBrands(),
        getAllCustomers(),
      ]);
      setMotos(motosData);
      setBrands(brandsData);
      setCustomers(customersData);
    } catch (error) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "Admin") {
        Swal.fire("Lỗi!", "Không thể tải dữ liệu", "error");
      }
      // Nếu không phải admin thì không hiện thông báo gì cả
    }
  };

  const handleDelete = async (licensePlate) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa xe này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        await deleteMoto(licensePlate);
        fetchData();
        Swal.fire("Thành công!", "Đã xóa xe", "success");
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể xóa xe", "error");
      }
    }
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "N/A";
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "N/A";
  };

  // Lọc danh sách theo biển số hoặc tên chủ xe
  const filteredMotos = motos.filter((moto) => {
    const customerName = getCustomerName(moto.customerId);
    return (
      moto.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Kiểm tra quyền admin hoặc employee
  const canEdit = userRole === "Admin" || userRole === "Employee";

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-6 mt-6 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6 drop-shadow-md">
        🛵 Danh sách xe máy
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <input
          type="text"
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Tìm theo biển số hoặc chủ xe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {canEdit && (
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white font-bold px-4 py-2 rounded-xl transition shadow"
          >
            <PlusCircle size={20} /> Thêm mới
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-6 py-3 text-center font-semibold">Biển số</th>
              <th className="px-6 py-3 text-center font-semibold">Tên xe</th>
              <th className="px-6 py-3 text-center font-semibold">Hãng xe</th>
              <th className="px-6 py-3 text-center font-semibold">Chủ xe</th>
              <th className="px-6 py-3 text-center font-semibold">Ngày gửi</th>
              <th className="px-6 py-3 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredMotos.length > 0 ? (
              filteredMotos.map((moto, idx) => (
                <tr
                  key={moto.licensePlate}
                  className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
                >
                  <td className="px-6 py-4 text-center">{moto.licensePlate}</td>
                  <td className="px-6 py-4 text-center">{moto.model}</td>
                  <td className="px-6 py-4 text-center">{getBrandName(moto.brandId)}</td>
                  <td className="px-6 py-4 text-center">{getCustomerName(moto.customerId)}</td>
                  <td className="px-6 py-4 text-center">
                    {new Date(moto.dateOfSent).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-center flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => {
                        setDetailMoto(moto);
                        setShowDetail(true);
                      }}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                      title="Chi tiết"
                    >
                      <Info size={16} /> Chi tiết
                    </button>
                    {canEdit && (
                      <>
                        <button
                          onClick={() => {
                            setEditing(moto);
                            setShowForm(true);
                          }}
                          className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                          title="Sửa"
                        >
                          <Pencil size={16} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(moto.licensePlate)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                          title="Xóa"
                        >
                          <Trash2 size={16} /> Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400 italic">
                  Không có xe máy nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Thêm/Sửa */}
      {showForm &&
        (editing ? (
          <EditMotoForm
            moto={editing}
            brands={brands}
            customers={customers}
            onClose={() => setShowForm(false)}
            onSaved={() => {
              setShowForm(false);
              fetchData();
            }}
          />
        ) : (
          <AddMotoForm
            brands={brands}
            customers={customers}
            onClose={() => setShowForm(false)}
            onSaved={() => {
              setShowForm(false);
              fetchData();
            }}
          />
        ))}

      {/* Chi tiết xe */}
      {showDetail && detailMoto && (
        <MotoDetails
          moto={detailMoto}
          brands={brands}
          customers={customers}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
