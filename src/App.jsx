import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"; // Import file CSS chính
import MainLayout from "./components/MainLayout";
import AuthContainer from "./components/AuthContainer"; // Import container chứa đăng nhập và đăng ký
import ForgotPassword from "./components/ForgotPassword"; // Import trang quên mật khẩu
import ResetPassword from "./components/ResetPassword"; // Import trang đặt lại mật khẩu
import ConfirmEmail from "./components/ConfirmEmail";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />

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
