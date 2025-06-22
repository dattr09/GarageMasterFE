const API_URL = "http://localhost:5119/api/parts"; // Đổi port nếu backend khác

export async function getAllParts() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5119/api/parts", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Không lấy được danh sách phụ tùng");
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
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(part),
  });
  if (!res.ok) throw new Error("Thêm phụ tùng thất bại");
  return res.json();
}

export async function updatePart(id, part) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/parts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(part)
  });
  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.message || "Cập nhật phụ tùng thất bại");
  return data;
}

export async function deletePart(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/parts/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.message || "Xóa phụ tùng thất bại");
  return data;
}

export async function updatePartQuantity(partId, quantityChange) {
  const token = localStorage.getItem("token");
  return fetch(`http://localhost:5119/api/parts/${partId}/quantity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ quantityChange }),
  }).then(res => {
    if (!res.ok) throw new Error("Cập nhật số lượng thất bại");
    return res.json();
  });
}