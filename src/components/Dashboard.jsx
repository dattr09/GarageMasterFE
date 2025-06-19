import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Hàm giải mã JWT (chỉ dùng cho demo, không bảo mật)
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const info = parseJwt(storedToken);
      // Kiểm tra token hết hạn
      if (info && info.exp && Date.now() >= info.exp * 1000) {
        localStorage.removeItem("token");
        setMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }
      setToken(storedToken);
      setUserInfo(info);
      setMessage("Chào mừng bạn đến với Dashboard!");
    } else {
      setMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserInfo(null);
    setMessage("Bạn đã đăng xuất thành công.");
    setTimeout(() => navigate("/login"), 1000);
  };

  if (!token) {
    return (
      <div>
        <h2>Dashboard</h2>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {message && <p>{message}</p>}
      {userInfo && (
        <div>
          <p>
            <b>Email:</b> {userInfo.email || userInfo.Email}
          </p>
          <p>
            <b>Vai trò:</b> {userInfo.role || userInfo.Role}
          </p>
        </div>
      )}
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}
