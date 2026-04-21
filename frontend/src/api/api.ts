import axios, { AxiosError } from "axios";

export const api = axios.create({ baseURL: import.meta.env.VITE_APP_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    const isRegisterRequest = error.config?.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      !isRegisterRequest
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
