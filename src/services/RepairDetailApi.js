const API_URL = "http://localhost:5119/api/repairdetail";

export async function getAllRepairDetails() {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Không lấy được danh sách chi tiết sửa chữa");
  return res.json();
}

export async function getRepairDetailById(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Không lấy được chi tiết sửa chữa");
  return res.json();
}

export async function createRepairDetail(data) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Thêm chi tiết sửa chữa thất bại");
  return res.json();
}

export async function updateRepairDetail(id, data) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Cập nhật chi tiết sửa chữa thất bại");
  return res.json();
}

export async function deleteRepairDetail(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Xóa chi tiết sửa chữa thất bại");
  return res.json();
}

export async function getRepairDetailsByOrderId(orderId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/order/${orderId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Không lấy được chi tiết sửa chữa");
  return res.json();
}

export async function updateRepairDetails(orderId, details) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/order/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(details),
  });
  if (!res.ok) throw new Error("Cập nhật chi tiết sửa chữa thất bại");
  return res;
}