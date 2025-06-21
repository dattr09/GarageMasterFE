const API_URL = "http://localhost:5119/api/reviews";

// Lấy tất cả đánh giá
export async function getAllReviews() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Không lấy được danh sách đánh giá");
  return res.json();
}

// Gửi đánh giá mới hoặc cập nhật
export async function createOrUpdateReview(data) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Gửi đánh giá thất bại");
  return res.json();
}