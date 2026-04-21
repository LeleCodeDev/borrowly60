import type { ApiResponse } from "../types/apiResponse";
import type {
  AdminDashboard,
  BorrowerDashboard,
  OfficerDashboard,
} from "../types/dashboard";
import { api } from "./api";

export const dashboardApi = {
  getAdminDashboard: () =>
    api
      .get<ApiResponse<AdminDashboard>>("/admin/dashboard")
      .then((r) => r.data.data),

  getOfficerDashboard: () =>
    api
      .get<ApiResponse<OfficerDashboard>>("/officer/dashboard")
      .then((r) => r.data.data),

  getBorrowerDashboard: () =>
    api
      .get<ApiResponse<BorrowerDashboard>>("/borrower/dashboard")
      .then((r) => r.data.data),
};
