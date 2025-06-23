const API_URL = "http://localhost:5119/api/repairorder";

export async function getAllRepairOrders() {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Không lấy được danh sách đơn sửa chữa");
  return res.json();
}

export async function getRepairOrderById(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Không lấy được đơn sửa chữa");
  return res.json();
}

export async function createRepairOrder(data) {
  // Tạo mới đơn sửa chữa
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Thêm đơn sửa chữa thất bại");
  return res.json();
}

export async function updateRepairOrder(id, data) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
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

export async function deleteRepairOrder(id) {
  // Xóa đơn sửa chữa
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Xóa đơn sửa chữa thất bại");
  return res;
}