import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/OrderApi";
import { ShoppingBag, Mail, Phone, MapPin, StickyNote, User } from "lucide-react";
import { updatePartQuantity } from "../services/PartsApi";

export default function Checkout() {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    email: "",
  });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    let name = "", email = "", phone = "";
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        name = user.fullName || user.name || user.username || "";
        email = user.email || "";
        phone = user.phone || "";
      } catch { }
    }
    setInfo((info) => ({ ...info, name, phone, email }));

    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = {
      userId,
      customerName: info.name,
      phone: info.phone,
      address: info.address,
      note: info.note,
      items: cart,
      total,
    };
    try {
      const res = await createOrder(order);
      
      // Update part quantities after successful order creation
      for (const item of cart) {
        if (item.quantity > item.maxQuantity || item.maxQuantity <= 0) {
          alert(`"${item.name}" đã hết hàng hoặc vượt quá tồn kho!`);
          return;
        }
        await updatePartQuantity(item.id, -item.quantity);
      }

      localStorage.removeItem("cart");
      setCart([]);
      window.dispatchEvent(new Event("cartChanged"));
      navigate("/order-success", { state: { orderId: res.id } });
    } catch (err) {
      alert("Đặt hàng thất bại!");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8 flex flex-col md:flex-row gap-10 animate-fade-in">
      {/* FORM */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center drop-shadow flex items-center justify-center gap-2">
          <ShoppingBag className="w-8 h-8" />
          Thông tin giao hàng
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { icon: <User />, name: "name", placeholder: "Họ tên" },
            { icon: <Phone />, name: "phone", placeholder: "Số điện thoại" },
            { icon: <MapPin />, name: "address", placeholder: "Địa chỉ giao hàng" },
            { icon: <Mail />, name: "email", placeholder: "Email liên hệ", type: "email" },
          ].map(({ icon, name, placeholder, type }) => (
            <div key={name} className="relative">
              <div className="absolute left-3 top-3 text-blue-600">{icon}</div>
              <input
                type={type || "text"}
                name={name}
                value={info[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          ))}
          <div className="relative">
            <div className="absolute left-3 top-3 text-blue-600">
              <StickyNote />
            </div>
            <textarea
              name="note"
              value={info.note}
              onChange={handleChange}
              placeholder="Ghi chú đơn hàng (nếu có)"
              rows={3}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition transform hover:scale-105"
          >
            Xác nhận đặt hàng
          </button>
        </form>
      </div>

      {/* CART */}
      <div className="w-full md:w-96 bg-white rounded-3xl shadow-lg p-6 h-fit">
        <h3 className="text-2xl font-bold text-blue-700 mb-5 text-center flex items-center justify-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          Giỏ hàng
        </h3>
        {cart.length === 0 ? (
          <p className="text-center text-gray-400 italic py-6">Không có sản phẩm nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-blue-700 font-semibold border-b">
                  <th className="py-2 text-left">Sản phẩm</th>
                  <th className="text-center">SL</th>
                  <th className="text-right">Tạm tính</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{(item.price * item.quantity).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-bold text-blue-800 mt-4 text-lg">
              Tổng cộng: {total.toLocaleString()} đ
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
