const API_BASE_URL = "http://localhost:5119/api/auth";

/**
 * Gửi yêu cầu API chung
 * @param {string} endpoint
 * @param {string} method
 * @param {Object} data
 * @param {boolean} includeCredentials
 * @returns {Promise<Object>}
 */
async function apiRequest(
  endpoint,
  method,
  data = null,
  includeCredentials = false
) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Thêm token vào header nếu có
    const token = localStorage.getItem("token");
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    if (includeCredentials) {
      options.credentials = "include";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw result || { message: "Unknown error occurred" };
    }

    return result;
  } catch (error) {
    // Xử lý lỗi mạng hoặc lỗi trả về từ server
    throw error.message
      ? error
      : { message: "Network error or server is unreachable" };
  }
}

// Đăng ký tài khoản
export async function register(data) {
  return apiRequest("/register", "POST", data);
}

// Xác nhận email
export async function confirmEmail(data) {
  return apiRequest("/confirm-email", "POST", data);
}

// Đăng nhập
export async function login(data) {
  return apiRequest("/login", "POST", data, true); // Bao gồm cookie
}
