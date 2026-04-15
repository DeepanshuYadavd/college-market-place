import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    // If data is an instance of FormData, axios sets the header automatically.
    // However, we can be explicit or add other custom logic here.
    if (config.data instanceof FormData) {
      // Browsers will set the boundary automatically, so it's often best NOT to manually set 'Content-Type'
      // but if we were to, it would be 'multipart/form-data'.
      // config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Optional: Handle auto-logout or redirect here if not using AuthContext for it
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
