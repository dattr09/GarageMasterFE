const API_BASE = "http://localhost:5119/api/invoices";

// Lấy token từ localStorage để tạo header xác thực
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

// Lấy danh sách hóa đơn
export async function getAllInvoices() {
  const res = await fetch(API_BASE, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Lỗi lấy danh sách hóa đơn");
  return res.json();
}

// Tạo hóa đơn mới
export async function createInvoice({ customerId, repairOrderId, paymentMethod }) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ customerId, repairOrderId, paymentMethod }),
  });
  if (!res.ok) throw new Error("Lỗi tạo hóa đơn");
  return res.json();
}

// Lấy chi tiết hóa đơn theo id
export async function getInvoiceById(id) {
  const res = await fetch(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Lỗi lấy chi tiết hóa đơn");
  return res.json();
}

// Lấy hóa đơn của người dùng hiện tại
export async function getMyInvoices() {
  const res = await fetch(`${API_BASE}/my`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Lỗi lấy hóa đơn của bạn");
  return res.json();
}