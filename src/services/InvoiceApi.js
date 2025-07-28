const API_BASE = "http://localhost:8080/api/invoices";

// Lấy token từ localStorage để tạo header xác thực
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

// Lấy danh sách hóa đơn (cần token)
export async function getAllInvoices() {
  const headers = getAuthHeaders();
  const res = await fetch(API_BASE, { headers });
  if (!res.ok) throw new Error("Lỗi lấy danh sách hóa đơn");
  return res.json();
}

// Tạo hóa đơn mới (cần token)
export async function createInvoice({ customerId, repairOrderId, paymentMethod }) {
  const headers = { "Content-Type": "application/json", ...getAuthHeaders() };
  const res = await fetch(API_BASE, {
    method: "POST",
    headers,
    body: JSON.stringify({ customerId, repairOrderId, paymentMethod }),
  });
  if (!res.ok) throw new Error("Lỗi tạo hóa đơn");
  return res.json();
}

// Lấy chi tiết hóa đơn theo id (cần token)
export async function getInvoiceById(id) {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_BASE}/${id}`, { headers });
  if (!res.ok) throw new Error("Lỗi lấy chi tiết hóa đơn");
  return res.json();
}

// Lấy hóa đơn của người dùng hiện tại (cần token)
export async function getMyInvoices() {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_BASE}/my`, { headers });
  if (!res.ok) throw new Error("Lỗi lấy hóa đơn của bạn");
  return res.json();
}