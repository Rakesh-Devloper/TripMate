import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * =========================================================
 * ATTACH JWT TOKEN TO EVERY REQUEST
 * =========================================================
 */
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "tripmate_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
 * =========================================================
 * HANDLE 401
 * =========================================================
 */
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error?.response?.status === 401
    ) {
      localStorage.removeItem(
        "tripmate_token"
      );
    }

    return Promise.reject(error);
  }
);

export default API;