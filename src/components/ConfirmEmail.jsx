import React, { useState } from "react";
import { confirmEmail } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ConfirmEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleConfirm = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await confirmEmail({ email, code });
      setMessage(res.message || "Xác nhận email thành công.");
      navigate("/login");
    } catch (error) {
      setMessage(error.message || "Xác nhận thất bại.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔐 Xác nhận Email</h2>
      <form onSubmit={handleConfirm} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mã xác nhận:</label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          ✅ Xác nhận
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    color: "#d9534f", // đỏ nếu lỗi
  },
};
