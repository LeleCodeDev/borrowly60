export interface BaseQuery {
  page?: number;
  size?: number;
  order?: "asc" | "desc";
  orderBy?: string;
}
