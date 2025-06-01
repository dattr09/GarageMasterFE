import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Lấy token từ localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setMessage("Chào mừng bạn đến với Dashboard!");
    } else {
      setMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
    }
  }, []);

  const handleLogout = () => {
    // Xóa token khỏi localStorage và làm mới trạng thái
    localStorage.removeItem("token");
    setToken(null);
    setMessage("Bạn đã đăng xuất thành công.");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {message && <p>{message}</p>}
      {token ? (
        <div>
          <p>
            <b>Token của bạn:</b> {token}
          </p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      ) : (
        <div>
          <p>Vui lòng đăng nhập để truy cập Dashboard.</p>
        </div>
      )}
    </div>
  );
}
