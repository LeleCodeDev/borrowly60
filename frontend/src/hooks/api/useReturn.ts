import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { returnApi } from "../../api/returnApi";
import type {
  ReturnQuery,
  ReturnUpdateForUserRequest,
} from "../../types/return";

export const useReturns = (params: ReturnQuery = {}) =>
  useQuery({
    queryKey: ["returns", params],
    queryFn: () => returnApi.getAll(params),
  });

export const useReturnCard = () =>
  useQuery({
    queryKey: ["return-card"],
    queryFn: () => returnApi.getCard(),
  });

export const useMyReturnCard = () =>
  useQuery({
    queryKey: ["my-return-card"],
    queryFn: () => returnApi.getMyCard(),
  });

export const useMyReturns = (params: ReturnQuery = {}) =>
  useQuery({
    queryKey: ["my-returns", params],
    queryFn: () => returnApi.myReturns(params),
  });

export const useCreateReturnForUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: returnApi.createForUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      queryClient.invalidateQueries({ queryKey: ["return-card"] });
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
    },
  });
};

export const useUpdateReturnForUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ReturnUpdateForUserRequest;
    }) => returnApi.updateForUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      queryClient.invalidateQueries({ queryKey: ["return-card"] });
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
    },
  });
};

export const useDeleteReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: returnApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      queryClient.invalidateQueries({ queryKey: ["return-card"] });
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
    },
  });
};
