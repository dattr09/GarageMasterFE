const API_URL = "http://localhost:8080/api/brands";

// Lấy tất cả hãng xe (public)
export async function getAllBrands() {
  const res = await fetch(API_URL, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Không lấy được danh sách hãng xe");
  return res.json();
}

// Tạo mới hãng xe (cần token)
export async function createBrand(data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Tạo hãng xe thất bại");
  return res.json();
}

// Cập nhật hãng xe (cần token)
export async function updateBrand(id, brand) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(brand),
  });
  if (!res.ok) throw new Error("Cập nhật hãng xe thất bại");
  return res.json();
}

// Xóa hãng xe (cần token)
export async function deleteBrand(id) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers,
  });
  if (res.status === 204) return;
  if (!res.ok) throw new Error("Xóa hãng xe thất bại");
}
