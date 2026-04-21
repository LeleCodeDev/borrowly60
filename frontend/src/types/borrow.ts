import type { BaseQuery } from "./baseQuery";
import type { Item } from "./item";
import type { User } from "./user";

export type BorrowStatus =
  | "pending"
  | "rejected"
  | "approved"
  | "borrowed"
  | "returned"
  | "canceled";

export interface Borrow {
  id: number;
  user: User | null;
  reviewedUser: User | null;
  item: Item | null;
  purpose: string;
  quantity: number;
  officerNote: string | null;
  borrowDate: string;
  returnDate: string;
  status: BorrowStatus;
  reviewAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowQuery extends BaseQuery {
  status?: BorrowStatus;
  startDate?: string;
  endDate?: string;
}

export interface BorrowRequest {
  itemId: number;
  quantity: number;
  purpose: string;
  borrowDate: string | null;
  returnDate: string | null;
}

export interface BorrowForUserRequest extends BorrowRequest {
  userId: number;
}

export interface BorrowError {
  userId: number;
  itemId: number;
  quantity: number;
  purpose: string;
  borrowDate: string;
  returnDate: string;
}

export interface BorrowApprovalRequest {
  officerNote: string | null;
}

export interface BorrowCard {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}
