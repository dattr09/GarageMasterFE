const API_URL = "http://localhost:8080/api/orders";

// Tạo đơn hàng mới (cần token)
export async function createOrder(order) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Đặt hàng thất bại");
  return res.json();
}

// Lấy danh sách đơn hàng theo user (cần token)
export async function getOrdersByUser(userId) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`http://localhost:8080/api/order/user/${userId}`, {
    headers
  });
  if (!res.ok) throw new Error("Không lấy được đơn hàng");
  return res.json();
}

// Lấy tất cả đơn hàng (cần token)
export async function getAllOrders() {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL, {
    headers
  });
  if (!res.ok) throw new Error("Không lấy được danh sách đơn hàng");
  return res.json();
}