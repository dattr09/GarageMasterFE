import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  // Lưu giỏ hàng trong localStorage, mỗi item: {id, name, price, quantity, image}
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  // Xóa sản phẩm khỏi giỏ
  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartChanged"));
  };

  // Thay đổi số lượng
  const updateQuantity = (id, quantity) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartChanged"));
  };

  // Tổng tiền
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center drop-shadow">Giỏ hàng</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-400 italic py-8">Giỏ hàng trống.</div>
      ) : (
        <>
          <table className="w-full mb-6">
            <thead>
              <tr className="text-blue-700 font-bold border-b">
                <th className="py-2">Ảnh</th>
                <th>Tên</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()} đ</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, Number(e.target.value))}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()} đ</td>
                  <td>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold text-lg text-blue-700 mb-4">
            Tổng: {total.toLocaleString()} đ
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-bold shadow transition"
              onClick={() => {
                navigate("/");
              }}
            >
              Huỷ
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-2 rounded-xl font-bold shadow transition"
              onClick={() => navigate("/checkout")}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </>
      )}
    </div>
  );
}