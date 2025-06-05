const API_URL = "http://localhost:5119/api/brand";

export async function getAllBrands() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Không lấy được danh sách hãng xe");
  return res.json();
}

export async function createBrand(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Tạo hãng xe thất bại");
  return res.json();
}

export async function updateBrand(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Cập nhật hãng xe thất bại");
  // Không cần return res.json() vì backend trả về 204
  return;
}

export async function deleteBrand(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Xóa hãng xe thất bại");
  // Không cần return res.json() vì backend trả về 204
  return;
}