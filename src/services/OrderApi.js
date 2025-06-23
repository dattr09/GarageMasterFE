const API_URL = "http://localhost:5119/api/order";

// Tạo đơn hàng mới
export async function createOrder(order) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error("Đặt hàng thất bại");
  return res.json();
}

// Lấy danh sách đơn hàng theo user
export async function getOrdersByUser(userId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5119/api/order/user/${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Không lấy được đơn hàng");
  return res.json();
}

// Lấy tất cả đơn hàng
export async function getAllOrders() {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Không lấy được danh sách đơn hàng");
  return res.json();
}