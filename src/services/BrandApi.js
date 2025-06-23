const API_URL = "http://localhost:5119/api/brand";

// Lấy tất cả hãng xe
export async function getAllBrands() {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Không lấy được danh sách hãng xe");
  return res.json();
}

// Tạo mới hãng xe
export async function createBrand(data) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Tạo hãng xe thất bại");
  return res.json();
}

// Cập nhật hãng xe
export async function updateBrand(id, brand) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(brand)
  });
  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.message || "Cập nhật hãng xe thất bại");
  return data;
}

// Xóa hãng xe
export async function deleteBrand(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${id}`, {
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
  if (!res.ok) throw new Error(data?.message || "Xóa hãng xe thất bại");
  return data;
}
