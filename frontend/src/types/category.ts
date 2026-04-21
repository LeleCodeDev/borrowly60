import type { BaseQuery } from "./baseQuery";

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
  description: string;
}

export interface CategoryQuery extends BaseQuery {
  search?: string;
  unpage?: boolean;
}

export interface CategoryError {
  name: string;
  description: string;
}
