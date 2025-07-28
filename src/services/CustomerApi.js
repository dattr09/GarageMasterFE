export const API_BASE_URL = "http://localhost:8080/api";
const API_URL = `${API_BASE_URL}/customers`;

// Lấy tất cả khách hàng (public)
export async function getAllCustomers() {
  const res = await fetch(API_URL, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Không lấy được danh sách khách hàng");
  return res.json();
}

// Lấy khách hàng theo id (public)
export async function getCustomerById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Không lấy được thông tin khách hàng");
  return res.json();
}

// Thêm khách hàng mới (cần token)
export async function createCustomer(data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      userId: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address
    })
  });
  if (!res.ok) throw new Error("Thêm khách hàng thất bại");
  return res.json();
}

// Sửa khách hàng (cần token)
export async function updateCustomer(id, customer) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      userId: customer.userId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    })
  });

  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }

  if (!res.ok) throw new Error(data?.message || "Cập nhật khách hàng thất bại");
  return data;
}

// Xóa khách hàng (cần token)
export async function deleteCustomer(id) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers
  });
  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.message || "Xóa khách hàng thất bại");
  return data;
}