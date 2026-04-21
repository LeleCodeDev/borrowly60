export interface AdminDashboard {
  totalItems: number;
  totalCategories: number;
  totalUsers: number;
  totalBorrows: number;
}

export interface BorrowerDashboard {
  totalPending: number;
  totalBorrowed: number;
  totalReturned: number;
}

export interface OfficerDashboard {
  totalPending: number;
  totalBorrowed: number;
  totalReturned: number;
  totalItems: number;
}
