import type { BaseQuery } from "./baseQuery";

export type UserRole = "admin" | "borrower" | "officer";
export type UserRoleRequest = "borrower" | "officer";

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserRequest {
  username: string;
  email: string;
  phone: string;
  role: UserRoleRequest;
  password: string;
}

export interface UserQuery extends BaseQuery {
  search?: string;
  role?: UserRoleRequest;
  unpage?: boolean;
}

export interface UserError {
  username: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

export interface UserCard {
  totalBorrowers: number;
  totalOfficers: number;
}
