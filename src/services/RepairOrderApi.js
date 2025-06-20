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
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  console.log(res)
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
  if (!res.ok) throw new Error("Cập nhật đơn sửa chữa thất bại");
  return res;
}

export async function deleteRepairOrder(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Xóa đơn sửa chữa thất bại");
  return res;
}