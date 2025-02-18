import axios from "axios";

// สร้าง Axios Instance
const axiosInstance = axios.create();

// Interceptor เพื่อเพิ่ม Authorization Header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor เพื่อตรวจจับ Response Error (เช่น Token หมดอายุ)
axiosInstance.interceptors.response.use(
  (response) => response, // ส่งผ่าน Response ถ้าไม่มีข้อผิดพลาด
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expired. Redirecting to login...");

      // ลบ Token ออกจาก Local Storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // เปลี่ยนเส้นทางไปที่หน้า Login
      window.location.href = "/login";
    }

    // ส่งข้อผิดพลาดกลับไป
    return Promise.reject(error);
  }
);

export default axiosInstance;
