/**
 * Axios instance terpusat untuk semua pemanggilan ke backend FastAPI.
 * - Otomatis menyisipkan Bearer token dari localStorage ke setiap request.
 * - Otomatis refresh token saat 401, dengan dedupe supaya request paralel
 * tidak memicu banyak refresh call sekaligus.
 * Semua service/hook di frontend WAJIB memakai instance ini (jangan fetch() langsung).
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Menggunakan URL dari env, dengan fallback langsung ke port 8000 (FastAPI)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dedupe: kalau beberapa request kena 401 bersamaan, cuma satu yang
// benar-benar manggil /auth/refresh; sisanya menunggu promise yang sama.
let refreshPromise: Promise<string> | null = null;

function performRefresh(refreshToken: string): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      // Pastikan endpoint refresh auth juga menggunakan base URL yang sama
      .post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken })
      .then(({ data }) => {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        return data.access_token as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

function redirectToLogin() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await performRefresh(refreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        redirectToLogin();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;