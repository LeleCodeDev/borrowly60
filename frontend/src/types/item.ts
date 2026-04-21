import type { BaseQuery } from "./baseQuery";
import type { Category } from "./category";

export type ItemStatus = "available" | "unavailable";

export interface Item {
  id: number;
  name: string;
  description: string;
  category: Category;
  quantity: number;
  image: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ItemCard {
  availableItems: number;
  unavailableItems: number;
}

export interface ItemRequest {
  name: string;
  description: string;
  categoryId: number;
  quantity: number;
  image?: File | null;
}

export interface ItemQuery extends BaseQuery {
  search?: string;
  categoryId?: number;
  status?: ItemStatus;
  unpage?: boolean;
}

export interface ItemError {
  name: string;
  description: string;
  categoryId: number;
  quantity: number;
}
