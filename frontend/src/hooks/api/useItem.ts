import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemApi } from "../../api/itemApi";
import type { ItemQuery, ItemRequest } from "../../types/item";

export const useItems = (params: ItemQuery = {}) =>
  useQuery({
    queryKey: ["items", params],
    queryFn: () => itemApi.getAll(params),
  });

export const useItemCard = () =>
  useQuery({
    queryKey: ["item-card"],
    queryFn: itemApi.getCard,
  });

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itemApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item-card"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemRequest }) =>
      itemApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item-card"] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itemApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item-card"] });
    },
  });
};
