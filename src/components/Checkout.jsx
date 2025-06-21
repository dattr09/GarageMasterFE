import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sinh mã hóa đơn ngẫu nhiên
    const orderId = "HD" + Date.now();
    localStorage.removeItem("cart");
    navigate("/order-success", { state: { orderId } });
  };

  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto mt-8 flex flex-col md:flex-row gap-8">
      {/* Form nhập thông tin */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">Thông tin giao hàng</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Họ tên</label>
            <input
              name="name"
              value={info.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập họ tên"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <input
              name="phone"
              value={info.phone}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Địa chỉ giao hàng</label>
            <input
              name="address"
              value={info.address}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập địa chỉ"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Ghi chú (nếu có)</label>
            <textarea
              name="note"
              value={info.note}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Ghi chú cho đơn hàng"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 text-white px-8 py-2 rounded-xl font-bold shadow transition"
          >
            Xác nhận đặt hàng
          </button>
        </form>
      </div>
      {/* Chi tiết sản phẩm giỏ hàng */}
      <div className="w-full md:w-96 bg-white rounded-2xl shadow-xl p-6 h-fit">
        <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">Sản phẩm trong giỏ</h3>
        {cart.length === 0 ? (
          <div className="text-gray-400 italic text-center">Không có sản phẩm nào.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-blue-700 font-bold border-b">
                <th className="py-1">Tên</th>
                <th>SL</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="py-1">{item.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{(item.price * item.quantity).toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="text-right font-bold text-blue-700 mt-4">
          Tổng: {total.toLocaleString()} đ
        </div>
      </div>
    </div>
  );
}