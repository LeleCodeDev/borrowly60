import type { ApiResponse } from "../types/apiResponse";
import type { BaseQuery } from "../types/baseQuery";
import type { Log } from "../types/log";
import { api } from "./api";

export const logApi = {
  get: (params: BaseQuery) =>
    api.get<ApiResponse<Log[]>>("/logs", { params }).then((r) => r.data),
};
