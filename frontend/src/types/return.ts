import type { BaseQuery } from "./baseQuery";
import type { Borrow } from "./borrow";

export interface Return {
  id: number;
  borrow: Borrow;
  actualReturnDate: string;
  borrowerNote: string | null;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  borrowerNote: string | null;
}

export interface ReturnQuery extends BaseQuery {
  startDate?: string;
  endDate?: string;
}

export interface ReturnCard {
  totalReturn: number;
  totalOverdue: number;
}

export interface ReturnCreateForUserRequest {
  borrowId: number;
  actualreturnDate: string | null;
}

export interface ReturnUpdateForUserRequest {
  actualReturnDate: string | null;
}

export interface ReturnError {
  borrowId: number;
  actualReturnDate: string;
}
