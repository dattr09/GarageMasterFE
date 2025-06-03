import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/MainLayout";
import AuthContainer from "./components/AuthContainer";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ConfirmEmail from "./components/ConfirmEmail";

// Hàm kiểm tra trạng thái đăng nhập
function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Nếu user đã đăng nhập thì chuyển về /dashboard, ngược lại thì /login */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/MainLayout" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Các route công khai */}
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/register" element={<AuthContainer />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />

        {/* Các route bảo vệ - tất cả path con nằm trong MainLayout */}
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
