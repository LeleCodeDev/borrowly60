export interface Pagination {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationQuery {
  page: number;
  size: number;
}
