import { useState } from "react";
import { register } from "../services/api"; // Import hàm register từ api.js

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      // Gửi yêu cầu đăng ký
      const res = await register({ email, password });
      setMessage(res.message || "Đăng ký thành công.");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      // Hiển thị lỗi chi tiết nếu có
      if (error.details?.errors) {
        const messages = Object.values(error.details.errors).flat();
        setMessage(messages.join(" | "));
      } else {
        setMessage(error.message || "Đăng ký thất bại.");
      }
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button type="submit">Đăng ký</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
