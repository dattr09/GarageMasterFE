import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Login from "./components/Login"; // Import trang đăng nhập
import "./App.css"; // Import file CSS chính
import AuthContainer from "./components/AuthContainer"; // Import container chứa đăng nhập và đăng ký

// Hàm kiểm tra trạng thái đăng nhập
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token"); // Kiểm tra token trong localStorage
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route đăng nhập */}
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />

        {/* Route được bảo vệ */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
