import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { borrowApi } from "../../api/borrowApi";
import type {
  BorrowApprovalRequest,
  BorrowQuery,
  BorrowRequest,
} from "../../types/borrow";

export const useBorrows = (params: BorrowQuery = {}) =>
  useQuery({
    queryKey: ["borrows", params],
    queryFn: () => borrowApi.getAll(params),
  });

export const useBorrowCard = () =>
  useQuery({
    queryKey: ["borrow-card"],
    queryFn: borrowApi.getCard,
  });

export const useMyBorrows = (params: BorrowQuery = {}) =>
  useQuery({
    queryKey: ["my-borrows", params],
    queryFn: () => borrowApi.myBorrows(params),
  });

export const useMyBorrowCard = () =>
  useQuery({
    queryKey: ["my-borrow-card"],
    queryFn: borrowApi.getMyCard,
  });

export const useCreateBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrow-card"] });
    },
  });
};

export const useCreateBorrowForUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.createForUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
    },
  });
};

export const useUpdateBorrowForUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BorrowRequest }) =>
      borrowApi.updateForUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
    },
  });
};

export const useApproveBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BorrowApprovalRequest }) =>
      borrowApi.approve(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
    },
  });
};

export const useRejectBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BorrowApprovalRequest }) =>
      borrowApi.reject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
    },
  });
};

export const useCancelBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrow-card"] });
    },
  });
};

export const useConfirmBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrow-card"] });
    },
  });
};

export const useReturnBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.return,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrows"] });
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      queryClient.invalidateQueries({ queryKey: ["my-returns"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrow-card"] });
      queryClient.invalidateQueries({ queryKey: ["return-card"] });
      queryClient.invalidateQueries({ queryKey: ["my-return-card"] });
    },
  });
};

export const useDeleteBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-card"] });
    },
  });
};
