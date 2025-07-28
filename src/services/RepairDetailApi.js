const API_URL = "http://localhost:8080/api/repairdetails";

// Lấy tất cả chi tiết sửa chữa (public)
export async function getAllRepairDetails() {
  const res = await fetch(API_URL, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Không lấy được danh sách chi tiết sửa chữa");
  return res.json();
}

// Lấy chi tiết sửa chữa theo id (public)
export async function getRepairDetailById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Không lấy được chi tiết sửa chữa");
  return res.json();
}

// Thêm chi tiết sửa chữa (cần token)
export async function createRepairDetail(data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Thêm chi tiết sửa chữa thất bại");
  return res.json();
}

// Cập nhật chi tiết sửa chữa (cần token)
export async function updateRepairDetail(id, data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Cập nhật chi tiết sửa chữa thất bại");
  return res.json();
}

// Xóa chi tiết sửa chữa (cần token)
export async function deleteRepairDetail(id) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers
  });
  if (!res.ok) throw new Error("Xóa chi tiết sửa chữa thất bại");
  return res.json();
}

// Lấy chi tiết sửa chữa theo orderId (public)
export async function getRepairDetailsByOrderId(orderId) {
  const res = await fetch(`${API_URL}/order/${orderId}`);
  if (!res.ok) throw new Error("Không lấy được chi tiết sửa chữa");
  return res.json();
}

// Cập nhật nhiều chi tiết sửa chữa (cần token)
export async function updateRepairDetails(orderId, details) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/order/${orderId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(details),
  });
  if (!res.ok) throw new Error("Cập nhật chi tiết sửa chữa thất bại");
  return res;
}