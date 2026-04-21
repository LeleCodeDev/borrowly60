import { useQuery } from "@tanstack/react-query";
import { logApi } from "../../api/logApi";
import type { BaseQuery } from "../../types/baseQuery";

export const useLogs = (params: BaseQuery = {}) =>
  useQuery({
    queryKey: ["logs", params],
    queryFn: () => logApi.get(params),
  });
