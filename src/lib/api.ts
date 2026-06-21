import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if the request was to check auth state (/auth/me)
      // or if we are already on login/register pages
      const isAuthCheck = error.config?.url === "/auth/me";
      if (!isAuthCheck && typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/masuk" && currentPath !== "/daftar" && currentPath !== "/") {
          window.location.href = "/masuk";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
