import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllCustomers, deleteCustomer } from "../../services/CustomerApi";
import CustomerAdd from "./CustomerAdd";
import CustomerEdit from "./CustomerEdit";
import CustomerDetails from "./CustomerDetails";
import { PlusCircle, Pencil, Trash2, Info } from "lucide-react";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const list = await getAllCustomers();
    setCustomers(list.reverse());
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa khách hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (result.isConfirmed) {
      await deleteCustomer(id);
      fetchCustomers();
      Swal.fire("Đã xóa!", "Khách hàng đã được xóa.", "success");
    }
  };

  // Sửa lại filteredCustomers để lọc theo search realtime
  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const nameParts = c.name.trim().toLowerCase().split(" ");
    const lastName = nameParts[nameParts.length - 1];
    return lastName.includes(search.trim().toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto p-6 mt-8 bg-white rounded-3xl shadow-xl border border-gray-200 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center drop-shadow-md">
        🧑‍💼 Danh sách khách hàng
      </h1>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex w-full sm:w-auto sm:flex-1">
          <input
            type="text"
            placeholder="Tìm khách hàng theo tên..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            list="customer-suggestions"
          />
          <datalist id="customer-suggestions">
            {customers
              .filter((c) => {
                if (!search.trim()) return false;
                const nameParts = c.name.trim().toLowerCase().split(" ");
                const lastName = nameParts[nameParts.length - 1];
                return lastName.includes(search.trim().toLowerCase());
              })
              .slice(0, 10)
              .map((c) => (
                <option key={c.id} value={c.name} />
              ))}
          </datalist>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white font-bold px-4 py-2 rounded-xl transition shadow"
        >
          <PlusCircle size={20} /> Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-100 text-blue-900">
            <tr className="text-center">
              <th className="px-6 py-3 font-semibold">Tên</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">SĐT</th>
              <th className="px-6 py-3 font-semibold">Địa chỉ</th>
              <th className="px-6 py-3 font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                  Không có khách hàng nào.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`transition text-center ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
                >
                  <td className="py-3 px-4 font-medium truncate max-w-[150px]">{c.name}</td>
                  <td className="py-3 px-4 truncate max-w-[180px]">{c.email}</td>
                  <td className="py-3 px-4">{c.phone}</td>
                  <td className="py-3 px-4 truncate max-w-[200px]">{c.address}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setDetailCustomer(c);
                          setShowDetail(true);
                        }}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                        title="Chi tiết"
                      >
                        <Info size={16} /> Chi tiết
                      </button>
                      <button
                        onClick={() => {
                          setEditing(c);
                          setShowForm(true);
                        }}
                        className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                        title="Sửa"
                      >
                        <Pencil size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                        title="Xóa"
                      >
                        <Trash2 size={16} /> Xóa
                      </button>
                    </div>
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
          <CustomerEdit
            customer={editing}
            onClose={() => setShowForm(false)}
            onSaved={() => {
              setShowForm(false);
              fetchCustomers();
            }}
          />
        ) : (
          <CustomerAdd
            onClose={() => setShowForm(false)}
            onSaved={() => {
              setShowForm(false);
              fetchCustomers();
            }}
          />
        ))}

      {/* Chi tiết khách hàng */}
      {showDetail && detailCustomer && (
        <CustomerDetails
          customer={detailCustomer}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}
