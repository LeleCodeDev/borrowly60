import type { ApiResponse } from "../types/apiResponse";
import type {
  Category,
  CategoryQuery,
  CategoryRequest,
} from "../types/category";
import { api } from "./api";

export const categoryApi = {
  getALl: (params: CategoryQuery) =>
    api
      .get<ApiResponse<Category[]>>(`/categories`, { params })
      .then((r) => r.data),

  create: (data: CategoryRequest) =>
    api.post<ApiResponse<Category>>("/categories", data).then((r) => r.data),

  update: (id: number, data: CategoryRequest) =>
    api
      .put<ApiResponse<Category>>(`categories/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`).then((r) => r.data),
};
