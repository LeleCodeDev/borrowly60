package dto

import (
	"time"

	"github.com/lelecodedev/borrowly/pkg/types"
)

type (
	ReturnQuery struct {
		StartDate time.Time `form:"start_date" time_format:"2006-01-02"`
		EndDate   time.Time `form:"end_date"   time_format:"2006-01-02"`
		PaginationQuery
		SortQuery
	}

	ReturnResponse struct {
		ID               uint            `json:"id"`
		Borrow           *BorrowResponse `json:"borrow"`
		ActualReturnDate time.Time       `json:"actualReturnDate"`
		BorrowerNote     *string         `json:"borrowerNote"`
		IsOverdue        bool            `json:"isOverdue"`
		CreatedAt        time.Time       `json:"createdAt"`
		UpdatedAt        time.Time       `json:"updatedAt"`
	}

	ReturnRequest struct {
		BorrowerNote *string `json:"borrowerNote"`
	}

	ReturnCreateForUserRequest struct {
		BorrowID         uint            `json:"borrowId" form:"borrowId" binding:"required,gt=0"`
		ActualReturnDate *types.DateOnly `json:"actualReturnDate" form:"returnDate" binding:"required" time_format:"2006-01-02"`
	}

	ReturnUpdateForUserRequest struct {
		ActualReturnDate *types.DateOnly `json:"actualReturnDate" form:"returnDate" binding:"required" time_format:"2006-01-02"`
	}

	ReturnCardResponse struct {
		TotalReturn  int64 `json:"totalReturn"`
		TotalOverdue int64 `json:"totalOverdue"`
	}
)

func (rq *ReturnQuery) SetDefaults() {
	rq.PaginationQuery.SetDefaults()
	rq.SortQuery.SetDefaults(OrderDesc, OrderCreatedAt)
}
