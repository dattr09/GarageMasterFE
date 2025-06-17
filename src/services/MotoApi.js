const API_URL = "http://localhost:5119/api/motos";

// Lấy tất cả xe
export async function getAllMotos() {
  const res = await fetch(API_URL);
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
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Thêm xe thất bại");
  return res.json();
}

// Sửa xe
export async function updateMoto(licensePlate, data) {
  const res = await fetch(`${API_URL}/${licensePlate}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("Cập nhật xe thất bại");
  }

  // Kiểm tra nếu response không rỗng thì mới parse JSON
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Xóa xe
export async function deleteMoto(licensePlate) {
  const res = await fetch(`${API_URL}/${licensePlate}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Xóa xe thất bại");
  return true;
}