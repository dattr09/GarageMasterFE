const API_URL = "http://localhost:5119/api/motos";

// Lấy tất cả xe
export async function getAllMotos() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5119/api/motos", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Không lấy được danh sách xe");
  return res.json();
}

// Lấy xe theo biển số
export async function getMotoById(licensePlate) {
  const res = await fetch(`${API_URL}/${licensePlate}`);
  if (!res.ok) throw new Error("Không lấy được thông tin xe");
  return res.json();
}

// Thêm xe mới
export async function createMoto(data) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Thêm xe thất bại");
  return res.json();
}

// Sửa xe
export async function updateMoto(licensePlate, moto) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/motos/${licensePlate}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(moto)
  });
  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }
  if (!res.ok) throw new Error(data?.message || "Cập nhật xe thất bại");
  return data;
}

// Xóa xe
export async function deleteMoto(licensePlate) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/motos/${licensePlate}`, {
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
  if (!res.ok) throw new Error(data?.message || "Xóa xe thất bại");
  return data;
}