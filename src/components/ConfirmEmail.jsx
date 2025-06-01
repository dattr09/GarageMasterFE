import React, { useState } from "react";
import { confirmEmail } from "../services/api"; // Import hàm confirmEmail từ api.js

export default function ConfirmEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await confirmEmail({ email, code }); // Gọi hàm confirmEmail từ api.js
      setMessage(res.message || "Xác nhận email thành công."); // Hiển thị thông báo từ server
    } catch (error) {
      setMessage(error.message || "Xác nhận thất bại."); // Hiển thị lỗi nếu có
    }
  };

  return (
    <div>
      <h2>Xác nhận Email</h2>
      <form onSubmit={handleConfirm}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label>Mã xác nhận: </label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit">Xác nhận</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
