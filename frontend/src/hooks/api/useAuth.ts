import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: authApi.me,
    staleTime: Infinity,
    retry: false,
    enabled: !!localStorage.getItem("token"),
  });

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      queryClient.setQueryData(["authUser"], data.data.user);
    },
  });

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      queryClient.setQueryData(["authUser"], data.data.user);
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.removeQueries({ queryKey: ["authUser"] });
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
};
