import type { ApiResponse } from "../types/apiResponse";
import type {
  Borrow,
  BorrowApprovalRequest,
  BorrowCard,
  BorrowForUserRequest,
  BorrowQuery,
  BorrowRequest,
} from "../types/borrow";
import { api } from "./api";
import type { ReturnRequest } from "../types/return";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const borrowApi = {
  getAll: (params: BorrowQuery) =>
    api.get<ApiResponse<Borrow[]>>("/borrows", { params }).then((r) => r.data),

  getCard: () =>
    api.get<ApiResponse<BorrowCard>>("/borrows/card").then((r) => r.data.data),

  myBorrows: (params: BorrowQuery) =>
    api
      .get<ApiResponse<Borrow[]>>("/my-borrows", { params })
      .then((r) => r.data),

  getMyCard: () =>
    api
      .get<ApiResponse<BorrowCard>>("/my-borrows/card")
      .then((r) => r.data.data),

  create: (data: BorrowRequest) =>
    api.post<ApiResponse<Borrow>>("/my-borrows", data).then((r) => r.data),

  createForUser: (data: BorrowForUserRequest) =>
    api.post<ApiResponse<Borrow>>("/borrows", data).then((r) => r.data),

  updateForUser: (id: number, data: BorrowRequest) =>
    api.put<ApiResponse<Borrow>>(`/borrows/${id}`, data).then((r) => r.data),

  approve: (id: number, data: BorrowApprovalRequest) =>
    api
      .put<ApiResponse<Borrow>>(`/borrows/${id}/approve`, data)
      .then((r) => r.data),

  reject: (id: number, data: BorrowApprovalRequest) =>
    api
      .put<ApiResponse<Borrow>>(`/borrows/${id}/reject`, data)
      .then((r) => r.data),

  cancel: (id: number) =>
    api
      .put<ApiResponse<Borrow>>(`/my-borrows/${id}/cancel`)
      .then((r) => r.data),

  confirm: (id: number) =>
    api
      .put<ApiResponse<Borrow>>(`/my-borrows/${id}/confirm`)
      .then((r) => r.data),

  return: ({ id, data }: { id: number; data: ReturnRequest }) =>
    api
      .put<ApiResponse<Borrow>>(`/my-borrows/${id}/return`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`borrows/${id}`).then((r) => r.data),

  downloadPDF: async (params: BorrowQuery) => {
    const query = new URLSearchParams(params as Record<string, string>);
    const res = await api.get(`${BASE_URL}/borrows/download-pdf?${query}`, {
      responseType: "blob",
    });

    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
    URL.revokeObjectURL(url);
  },
};
