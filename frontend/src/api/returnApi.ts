import type { ApiResponse } from "../types/apiResponse";
import type {
  Return,
  ReturnCard,
  ReturnCreateForUserRequest,
  ReturnQuery,
  ReturnUpdateForUserRequest,
} from "../types/return";
import { api } from "./api";

export const returnApi = {
  getAll: (params: ReturnQuery) =>
    api.get<ApiResponse<Return[]>>("/returns", { params }).then((r) => r.data),

  getCard: () =>
    api.get<ApiResponse<ReturnCard>>("/returns/card").then((r) => r.data.data),

  getMyCard: () =>
    api
      .get<ApiResponse<ReturnCard>>("/my-returns/card")
      .then((r) => r.data.data),

  myReturns: (params: ReturnQuery) =>
    api
      .get<ApiResponse<Return[]>>("/my-returns", { params })
      .then((r) => r.data),

  createForUser: (data: ReturnCreateForUserRequest) =>
    api.post<ApiResponse<Return>>("/returns", data).then((r) => r.data),

  updateForUser: (id: number, data: ReturnUpdateForUserRequest) =>
    api.put<ApiResponse<Return>>(`/returns/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/returns/${id}`).then((r) => r.data),
};
