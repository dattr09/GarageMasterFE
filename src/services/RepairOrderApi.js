const API_URL = "http://localhost:8080/api/repairorders";

// Lấy tất cả đơn sửa chữa (public)
export async function getAllRepairOrders() {
  const res = await fetch(API_URL, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Không lấy được danh sách đơn sửa chữa");
  return res.json();
}

// Lấy đơn sửa chữa theo id (public)
export async function getRepairOrderById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Không lấy được đơn sửa chữa");
  return res.json();
}

// Tạo mới đơn sửa chữa (cần token)
export async function createRepairOrder(data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Thêm đơn sửa chữa thất bại");
  return res.json();
}

// Cập nhật đơn sửa chữa (cần token)
export async function updateRepairOrder(id, data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    let message = "Cập nhật đơn sửa chữa thất bại";
    try {
      const text = await res.text();
      if (text) {
        const err = JSON.parse(text);
        if (err?.message) message = err.message;
      }
    } catch { }
    throw new Error(message);
  }
}

// Xóa đơn sửa chữa (cần token)
export async function deleteRepairOrder(id) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers
  });
  if (!res.ok) throw new Error("Xóa đơn sửa chữa thất bại");
  return res;
}