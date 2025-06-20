export const API_BASE_URL = "http://localhost:5119/api";
const API_URL = `${API_BASE_URL}/customers`;

// Lấy tất cả khách hàng
export async function getAllCustomers() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5119/api/customers", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Không lấy được danh sách khách hàng");
  return res.json();
}

// Lấy khách hàng theo id
export async function getCustomerById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Không lấy được thông tin khách hàng");
  return res.json();
}

// Thêm khách hàng mới
export async function createCustomer(data) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5119/api/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: data.userId,
      name: data.name,
      email: data.email,      // thêm dòng này
      phone: data.phone,
      address: data.address
    })
  });
  if (!res.ok) throw new Error("Thêm khách hàng thất bại");
  return res.json();
}

// Sửa khách hàng
export async function updateCustomer(id, customer) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: customer.userId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    })
  });

  let data = null;
  if (res.status !== 204) {
    data = await res.json();
  }

  if (!res.ok) throw new Error(data?.message || "Cập nhật khách hàng thất bại");
  return data;
}

// Xóa khách hàng
export async function deleteCustomer(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/customers/${id}`, {
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
  if (!res.ok) throw new Error(data?.message || "Xóa khách hàng thất bại");
  return data;
}