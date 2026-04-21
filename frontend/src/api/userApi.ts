import type { ApiResponse } from "../types/apiResponse";
import type { User, UserCard, UserQuery, UserRequest } from "../types/user";
import { api } from "./api";

export const userApi = {
  getAll: (params: UserQuery) =>
    api.get<ApiResponse<User[]>>("users", { params }).then((r) => r.data),

  getCard: () =>
    api.get<ApiResponse<UserCard>>("/users/card").then((r) => r.data.data),

  create: (data: UserRequest) =>
    api.post<ApiResponse<User>>("/users", data).then((r) => r.data),

  update: (id: number, data: UserRequest) =>
    api.put<ApiResponse<User>>(`users/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse<User>>(`users/${id}`).then((r) => r.data),
};
