package dto

type (
	AdminDashbordResponse struct {
		TotalItems      int64 `json:"totalItems"`
		TotalCategories int64 `json:"totalCategories"`
		TotalUsers      int64 `json:"totalUsers"`
		TotalBorrows    int64 `json:"totalBorrows"`
	}

	BorrowerDashbordResponse struct {
		TotalPending  int64 `json:"totalPending"`
		TotalBorrowed int64 `json:"totalBorrowed"`
		TotalReturned int64 `json:"totalReturned"`
	}

	OfficerDashbordResponse struct {
		TotalPending  int64 `json:"totalPending"`
		TotalBorrowed int64 `json:"totalBorrowed"`
		TotalReturned int64 `json:"totalReturned"`
		TotalItems    int64 `json:"totalItems"`
	}
)
