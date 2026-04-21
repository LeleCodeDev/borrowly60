import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CategoryQuery, CategoryRequest } from "../../types/category";
import { categoryApi } from "../../api/categoryApi";

export const useCategories = (params: CategoryQuery = {}) =>
  useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.getALl(params),
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
