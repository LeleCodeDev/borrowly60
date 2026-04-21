import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboardApi";

export const useAdminDashboard = () =>
  useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: dashboardApi.getAdminDashboard,
  });

export const useOfficerDashboard = () =>
  useQuery({
    queryKey: ["officer-dashboard"],
    queryFn: dashboardApi.getOfficerDashboard,
  });

export const useBorrowerDashboard = () =>
  useQuery({
    queryKey: ["borrower-dashboard"],
    queryFn: dashboardApi.getBorrowerDashboard,
  });
