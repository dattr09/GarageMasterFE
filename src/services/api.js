const API_BASE_URL = "http://localhost:8080/api/auth";

/**
 * Gửi yêu cầu API chung
 * @param {string} endpoint
 * @param {string} method
 * @param {Object} data
 * @param {boolean} includeCredentials
 * @param {boolean} requireAuth
 * @returns {Promise<Object>}
 */
async function apiRequest(
  endpoint,
  method,
  data = null,
  includeCredentials = false,
  requireAuth = true
) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (requireAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    if (includeCredentials) {
      options.credentials = "include";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (!response.ok) {
      throw result || { message: "Unknown error occurred" };
    }

    return result;
  } catch (error) {
    throw error.message
      ? error
      : { message: "Network error or server is unreachable" };
  }
}

// Đăng ký tài khoản
export async function register(data) {
  const res = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw error;
  }
  return res.text();
}

// Xác nhận email
export async function confirmEmail(data) {
  return apiRequest("/confirm-email", "POST", data, false, false);
}

// Đăng nhập
export async function login(data) {
  return apiRequest("/login", "POST", data, false, false);
}

// Đặt lại mật khẩu
export async function forgotPassword(data) {
  return apiRequest("/forgot-password", "POST", data, false, false);
}

// Đặt lại mật khẩu qua email
export async function resetPassword(data) {
  return apiRequest("/reset-password", "POST", data, false, false);
}
