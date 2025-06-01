import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const MainLayout = () => {
  return (
    <div
      className="main-layout"
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      {/* Header / Navbar */}
      <header
        style={{ background: "#004080", color: "white", padding: "1rem 2rem" }}
      >
        <h1>GarageMaster</h1>
      </header>

      {/* Content area with sidebar + main */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Sidebar */}
        <nav
          style={{
            width: 220,
            background: "#00264d",
            color: "white",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              color: isActive ? "#00bfff" : "white",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/vehicles"
            style={({ isActive }) => ({
              color: isActive ? "#00bfff" : "white",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Quản lý xe
          </NavLink>
          <NavLink
            to="/orders"
            style={({ isActive }) => ({
              color: isActive ? "#00bfff" : "white",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Đơn hàng
          </NavLink>
          <NavLink
            to="/customers"
            style={({ isActive }) => ({
              color: isActive ? "#00bfff" : "white",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Khách hàng
          </NavLink>
          <NavLink
            to="/staff"
            style={({ isActive }) => ({
              color: isActive ? "#00bfff" : "white",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Nhân viên
          </NavLink>
          {/* Thêm link khác nếu cần */}
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "1.5rem", background: "#f5f5f5" }}>
          {/* Outlet là nơi các route con sẽ render */}
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#004080",
          color: "white",
          padding: "1rem 2rem",
          textAlign: "center",
        }}
      >
        © 2025 GarageMaster - Bản quyền thuộc về bạn
      </footer>
    </div>
  );
};

export default MainLayout;
