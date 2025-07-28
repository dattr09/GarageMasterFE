const API_URL = "http://localhost:8080/api/employees";

// Lấy danh sách nhân viên (cần token)
export async function getAllEmployees() {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, { headers });
  if (!res.ok) throw new Error("Không lấy được danh sách nhân viên");
  return res.json();
}

// Đăng ký nhân viên mới (cần token)
export async function registerEmployee(data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Thêm nhân viên thất bại");
  return res.json();
}

// Xóa nhân viên theo id (cần token)
export async function deleteEmployee(id) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers
  });
  if (!res.ok) throw new Error("Xoá nhân viên thất bại");
}

// Cập nhật thông tin nhân viên (cần token)
export async function updateEmployee(id, data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Cập nhật nhân viên thất bại");
  if (res.status === 204) return null;
  return await res.json();
}