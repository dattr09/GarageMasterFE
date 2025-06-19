import React, { useEffect, useState } from "react";
import { getAllMotos, deleteMoto } from "../../services/MotoApi";
import { getAllBrands } from "../../services/BrandApi";
import { getAllCustomers } from "../../services/CustomerApi";
import Swal from "sweetalert2";
import AddMotoForm from "./AddMotoForm";
import EditMotoForm from "./EditMotoForm";
import MotoDetails from "./MotoDetails";

export default function MotoList() {
  const [motos, setMotos] = useState([]);
  const [brands, setBrands] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailMoto, setDetailMoto] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
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
      console.error("Error fetching data:", error);
      Swal.fire("Lỗi!", "Không thể tải dữ liệu", "error");
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

  const handleSearch = () => {
    if (!search.trim()) {
      fetchData();
      return;
    }
    const filtered = motos.filter(
      (m) =>
        m.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
        m.model.toLowerCase().includes(search.toLowerCase())
    );
    setMotos(filtered);
  };

  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "N/A";
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "N/A";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Quản lý xe máy
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="Tìm theo biển số..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow transition"
          >
            Tìm kiếm
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow transition"
          >
            Thêm mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Biển số</th>
                <th className="py-3 px-4 text-left">Tên Xe</th>
                <th className="py-3 px-4 text-left">Hãng xe</th>
                <th className="py-3 px-4 text-left">Chủ xe</th>
                <th className="py-3 px-4 text-left">Ngày gửi</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {motos.map((moto, index) => (
                <tr
                  key={moto.licensePlate}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-2 px-4">{moto.licensePlate}</td>
                  <td className="py-2 px-4">{moto.model}</td>
                  <td className="py-2 px-4">{getBrandName(moto.brandId)}</td>
                  <td className="py-2 px-4">{getCustomerName(moto.customerId)}</td>
                  <td className="py-2 px-4">
                    {new Date(moto.dateOfSent).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setDetailMoto(moto);
                          setShowDetail(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => {
                          setEditing(moto);
                          setShowForm(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(moto.licensePlate)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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