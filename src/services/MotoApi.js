const API_URL = "http://localhost:8080/api/motos";

// Lấy tất cả xe (public)
export async function getAllMotos() {
  const res = await fetch(API_URL, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Không lấy được danh sách xe");
  return res.json();
}

// Lấy xe theo biển số (public)
export async function getMotoById(licensePlate) {
  const res = await fetch(`${API_URL}/${licensePlate}`);
  if (!res.ok) throw new Error("Không lấy được thông tin xe");
  return res.json();
}

// Thêm, sửa, xóa xe (cần token)
export async function createMoto(data) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Thêm xe thất bại  ");
  return res.json();
}

export async function updateMoto(licensePlate, moto) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${licensePlate}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(moto),
  });
  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.message || "Cập nhật xe thất bại");
  return data;
}

export async function deleteMoto(licensePlate) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${licensePlate}`, {
    method: "DELETE",
    headers,
  });
  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.message || "Xóa xe thất bại");
  return data;
}
