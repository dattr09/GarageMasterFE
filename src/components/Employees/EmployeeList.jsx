import React, { useEffect, useState } from "react";
import { getAllEmployees, deleteEmployee } from "../../services/EmployeeApi";
import EmployeeAdd from "./EmployeeAdd";
import EmployeeDetails from "./EmployeeDetails";
import EmployeeEdit from "./EmployeeEdit";
import Swal from "sweetalert2";
import { PlusCircle, Info, Pencil, Trash2 } from "lucide-react";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const data = await getAllEmployees();
    setEmployees(data);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xoá nhân viên này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
        Swal.fire("Đã xoá!", "Nhân viên đã được xoá.", "success");
      } catch (err) {
        Swal.fire("Lỗi", err.message || "Xoá nhân viên thất bại", "error");
      }
    }
  };

  function getRoleName(role) {
    switch (role) {
      case 1:
      case "Admin":
        return "Quản trị";
      case 2:
      case "Manager":
        return "Quản lý";
      case 3:
      case "Accountant":
        return "Kế toán";
      case 4:
      case "Employee":
        return "Nhân viên";
      default:
        return role;
    }
  }

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-6 mt-6 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6 drop-shadow-md">
        👨‍🔧 Danh sách nhân viên
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <input
          type="text"
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Tìm theo tên nhân viên..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white font-bold px-4 py-2 rounded-xl transition shadow"
        >
          <PlusCircle size={20} /> Thêm mới
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-6 py-3 text-center font-semibold">Tên</th>
              <th className="px-6 py-3 text-center font-semibold">SĐT</th>
              <th className="px-6 py-3 text-center font-semibold">Địa chỉ</th>
              <th className="px-6 py-3 text-center font-semibold">Vai trò</th>
              <th className="px-6 py-3 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400 italic">
                  Không có nhân viên nào.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((e, idx) => (
                <tr
                  key={e.id}
                  className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
                >
                  <td className="px-6 py-4 text-center font-medium">{e.name}</td>
                  <td className="px-6 py-4 text-center">{e.phone}</td>
                  <td className="px-6 py-4 text-center">{e.address}</td>
                  <td className="px-6 py-4 text-center">{getRoleName(e.employeeRole)}</td>
                  <td className="px-6 py-4 text-center flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => setDetailEmployee(e)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                      title="Chi tiết"
                    >
                      <Info size={16} /> Chi tiết
                    </button>
                    <button
                      onClick={() => setEditEmployee(e)}
                      className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow font-semibold transition"
                      title="Sửa"
                    >
                      <Pencil size={16} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
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

      {/* Popup thêm */}
      {showAdd && (
        <EmployeeAdd
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            fetchEmployees();
          }}
        />
      )}

      {/* Popup chi tiết */}
      {detailEmployee && (
        <EmployeeDetails
          employee={detailEmployee}
          onClose={() => setDetailEmployee(null)}
        />
      )}

      {/* Popup sửa */}
      {editEmployee && (
        <EmployeeEdit
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSaved={() => {
            setEditEmployee(null);
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}
