import type { ApiResponse } from "../types/apiResponse";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";
import type { User } from "../types/user";
import { api } from "./api";

export const authApi = {
  me: () =>
    api.get<ApiResponse<User>>("/auth/me").then((r) => r.data.data || null),

  login: (data: LoginRequest) =>
    api
      .post<ApiResponse<AuthResponse>>("/auth/login", data)
      .then((r) => r.data),

  register: (data: RegisterRequest) =>
    api
      .post<ApiResponse<AuthResponse>>("/auth/register", data)
      .then((r) => r.data),
};
