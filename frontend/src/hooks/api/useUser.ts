import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";
import type { UserQuery, UserRequest } from "../../types/user";

export const useUsers = (params: UserQuery = {}) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getAll(params),
  });

export const useUserCard = () =>
  useQuery({
    queryKey: ["user-card"],
    queryFn: userApi.getCard,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-card"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserRequest }) =>
      userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-card"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-card"] });
    },
  });
};
