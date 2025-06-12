export const API_BASE_URL = "http://localhost:5119/api";
const API_URL = `${API_BASE_URL}/customers`;

// Lấy tất cả khách hàng
export async function getAllCustomers() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Không lấy được danh sách khách hàng");
  return res.json();
}

// Lấy khách hàng theo id
export async function getCustomerById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Không lấy được thông tin khách hàng");
  return res.json();
}

// Thêm khách hàng mới
export async function createCustomer(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Thêm khách hàng thất bại");
  return res.json();
}

// Sửa khách hàng
export async function updateCustomer(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Cập nhật khách hàng thất bại");
  return;
}

// Xóa khách hàng
export async function deleteCustomer(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa khách hàng thất bại");
  return;
}