const API_URL = "http://localhost:8080/api/parts";

// Lấy tất cả phụ tùng (public)
export async function getAllParts() {
  const res = await fetch(API_URL, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error("Không lấy được danh sách phụ tùng");
  return res.json();
}

// Lấy phụ tùng theo id (public)
export async function getPartById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

// Tìm kiếm phụ tùng theo tên (public)
export async function searchPartsByName(name) {
  const res = await fetch(`${API_URL}/searchByName?name=${encodeURIComponent(name)}`);
  return res.json();
}

// Lấy phụ tùng theo hãng (public)
export async function getPartsByBrand(brandId) {
  const res = await fetch(`${API_URL}/byBrand/${brandId}`);
  return res.json();
}

// Thêm phụ tùng mới (cần token)
export async function createPart(part) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(part),
  });
  if (!res.ok) throw new Error("Thêm phụ tùng thất bại");
  return res.json();
}

// Cập nhật phụ tùng (cần token)
export async function updatePart(id, part) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(part)
  });
  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.message || "Cập nhật phụ tùng thất bại");
  return data;
}

// Xóa phụ tùng (cần token)
export async function deletePart(id) {
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
  if (!res.ok) throw new Error(data?.message || "Xóa phụ tùng thất bại");
  return data;
}

// Cập nhật số lượng phụ tùng (cần token)
export async function updatePartQuantity(partId, quantityChange) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/${partId}/quantity`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ quantityChange }),
  });
  if (!res.ok) throw new Error("Cập nhật số lượng thất bại");
  return res.json();
}