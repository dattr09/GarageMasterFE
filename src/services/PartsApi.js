const API_URL = "http://localhost:5119/api/parts"; // Đổi port nếu backend khác

export async function getAllParts() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getPartById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function searchPartsByName(name) {
  const res = await fetch(`${API_URL}/searchByName?name=${encodeURIComponent(name)}`);
  return res.json();
}

export async function getPartsByBrand(brandId) {
  const res = await fetch(`${API_URL}/byBrand/${brandId}`);
  return res.json();
}

export async function createPart(part) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(part),
  });
  if (!res.ok) throw new Error("Thêm phụ tùng thất bại");
  return res.json();
}

export async function updatePart(id, part) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(part),
  });
  if (!res.ok) throw new Error("Cập nhật phụ tùng thất bại");
  return res.json();
}

export async function deletePart(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return res;
}