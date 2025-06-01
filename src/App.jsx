import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Login from "./components/Login"; // Import trang đăng nhập

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
        <Route path="/login" element={<Login />} />

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
