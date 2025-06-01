import React, { useState } from "react";
import { login } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const data = await login({ email, password });
      setMessage(data.message || "Đăng nhập thành công.");
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error) {
      setMessage(error.message || "Đăng nhập thất bại.");
      setToken(null);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đăng nhập</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <label style={styles.label}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="Nhập email của bạn"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Mật khẩu
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            style={styles.input}
          />
        </label>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {message && (
        <p
          style={{
            ...styles.message,
            color: message.includes("thành công") ? "green" : "red",
          }}
          role="alert"
        >
          {message}
        </p>
      )}

      {token && (
        <div style={styles.tokenBox}>
          <b>Token:</b> <code>{token}</code>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "40px auto",
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    color: "#004080",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "600",
    color: "#333",
    fontSize: 14,
  },
  input: {
    marginTop: 6,
    padding: "10px 12px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    marginTop: 8,
    padding: "12px 16px",
    fontSize: 16,
    backgroundColor: "#004080",
    color: "#fff",
    fontWeight: "700",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  message: {
    marginTop: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  tokenBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 6,
    fontSize: 12,
    wordBreak: "break-all",
    textAlign: "center",
    color: "#004080",
  },
};
