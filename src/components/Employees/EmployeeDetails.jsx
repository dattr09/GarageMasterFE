import React from "react";

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

export default function EmployeeDetails({ employee, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-blue-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          title="Đóng"
          type="button"
        >
          ×
        </button>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide drop-shadow">
          Chi tiết nhân viên
        </h3>
        <div className="grid grid-cols-1 gap-4 text-gray-700 text-base">
          <div><b>Tên:</b> {employee.name}</div>
          <div><b>Số điện thoại:</b> {employee.phone}</div>
          <div><b>Địa chỉ:</b> {employee.address}</div>
          <div><b>Vai trò:</b> {getRoleName(employee.employeeRole)}</div>
          <div><b>Ngày vào làm:</b> {new Date(employee.dateJoined).toLocaleDateString("vi-VN")}</div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold px-12 py-3 rounded-2xl shadow-xl transition text-lg tracking-wide"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}