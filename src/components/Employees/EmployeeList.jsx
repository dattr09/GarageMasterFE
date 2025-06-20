import React, { useEffect, useState } from "react";
import { getAllEmployees, deleteEmployee } from "../../services/EmployeeApi";
import EmployeeAdd from "./EmployeeAdd";
import EmployeeDetails from "./EmployeeDetails";
import EmployeeEdit from "./EmployeeEdit";
import Swal from "sweetalert2";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);

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

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">
        Danh sách nhân viên
      </h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAdd(true)}
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
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">SĐT</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">Địa chỉ</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide">Vai trò</th>
              <th className="py-3 px-4 text-center font-bold text-base tracking-wide rounded-tr-xl">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 italic bg-gray-50 rounded-b-xl">
                  Không có nhân viên nào.
                </td>
              </tr>
            ) : (
              employees.map((e, idx) => (
                <tr key={e.id}
                  className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}>
                  <td className="py-3 px-4 text-center font-medium">{e.name}</td>
                  <td className="py-3 px-4 text-center">{e.phone}</td>
                  <td className="py-3 px-4 text-center">{e.address}</td>
                  <td className="py-3 px-4 text-center">{getRoleName(e.employeeRole)}</td>
                  <td className="py-3 px-4 flex justify-center items-center gap-2 align-middle">
                    <button
                      onClick={() => setDetailEmployee(e)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                      title="Chi tiết"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => setEditEmployee(e)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                      title="Sửa"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-lg shadow font-semibold transition"
                      title="Xoá"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <EmployeeAdd
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            fetchEmployees(); // Phải gọi lại để load danh sách mới
          }}
        />
      )}
      {detailEmployee && (
        <EmployeeDetails
          employee={detailEmployee}
          onClose={() => setDetailEmployee(null)}
        />
      )}
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