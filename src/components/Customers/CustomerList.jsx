import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllCustomers, deleteCustomer } from "../../services/CustomerApi";
import CustomerAdd from "./CustomerAdd";
import CustomerEdit from "./CustomerEdit";
import CustomerDetails from "./CustomerDetails";

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
    setCustomers(list);
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

  // Nếu backend có API search thì import và dùng, nếu không thì filter local:
  const handleSearch = async () => {
    if (!search.trim()) {
      fetchCustomers();
      return;
    }
    // Nếu có API search:
    // const list = await searchCustomerByName(search);
    // setCustomers(list);

    // Nếu không có API search:
    setCustomers(
      customers.filter((c) =>
        c.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 mt-8 border border-blue-100">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
        Danh sách khách hàng
      </h2>
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
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-green-600 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Thêm mới
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900">
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tl-xl">Tên</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">Email</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">SĐT</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">Địa chỉ</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tr-xl">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 italic bg-gray-50 rounded-b-xl">
                  Không có khách hàng nào.
                </td>
              </tr>
            ) : (
              customers.map((c, idx) => (
                <tr key={c.id}
                  className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}>
                  <td className="py-3 px-4 text-center font-medium">{c.name}</td>
                  <td className="py-3 px-4 text-center">{c.email}</td>
                  <td className="py-3 px-4 text-center">{c.phone}</td>
                  <td className="py-3 px-4 text-center">{c.address}</td>
                  <td className="py-3 px-4 flex justify-center items-center gap-2 align-middle">
                    <button
                      onClick={() => { setDetailCustomer(c); setShowDetail(true); }}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                      title="Chi tiết"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => { setEditing(c); setShowForm(true); }}
                      className="bg-yellow-400 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                      title="Sửa"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
          <CustomerEdit
            customer={editing}
            onClose={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); fetchCustomers(); }}
          />
        ) : (
          <CustomerAdd
            onClose={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); fetchCustomers(); }}
          />
        )
      )}
      {/* Popup Chi tiết */}
      {showDetail && detailCustomer && (
        <CustomerDetails
          customer={detailCustomer}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}