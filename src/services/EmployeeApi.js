export async function getAllEmployees() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5119/api/v1/employees", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Không lấy được danh sách nhân viên");
  return res.json();
}

export async function registerEmployee(data) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5119/api/v1/employees/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Thêm nhân viên thất bại");
  return res.json();
}

export async function deleteEmployee(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/v1/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Xoá nhân viên thất bại");
}

export async function updateEmployee(id, data) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/v1/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Cập nhật nhân viên thất bại");
  if (res.status === 204) return null; // No Content
  return await res.json();
}