import type { Pagination } from "./pagination";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface ApiError<T> {
  success: boolean;
  message: string;
  data: null;
  errors?: T;
}
