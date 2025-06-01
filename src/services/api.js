const API_BASE_URL = "http://localhost:5119/api/auth";

/**
 * Hàm chung để thực hiện các yêu cầu API
 * @param {string} endpoint - Đường dẫn endpoint (ví dụ: '/register')
 * @param {string} method - Phương thức HTTP (ví dụ: 'POST', 'GET')
 * @param {Object} data - Dữ liệu gửi đi (nếu có)
 * @param {boolean} includeCredentials - Có gửi cookie không (mặc định là false)
 * @returns {Promise<Object>} - Kết quả từ server
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

    if (data) {
      options.body = JSON.stringify(data);
    }

    if (includeCredentials) {
      options.credentials = "include";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw result || { message: "Unknown error occurred" }; // Thêm thông báo lỗi mặc định
    }

    return result;
  } catch (error) {
    throw error.message
      ? error
      : { message: "Network error or server is unreachable" };
  }
}

// Hàm đăng ký
export async function register(data) {
  return apiRequest("/register", "POST", data);
}

// Hàm xác nhận email
export async function confirmEmail(data) {
  return apiRequest("/confirm-email", "POST", data);
}

// Hàm đăng nhập
export async function login(data) {
  return apiRequest("/login", "POST", data, true); // Bao gồm cookie
}
