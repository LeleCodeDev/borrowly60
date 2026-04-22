package dto

import (
	"time"

	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/pkg/types"
)

type (
	BorrowQuery struct {
		Status    model.BorrowStatus `json:"status" form:"status" binding:"omitempty,oneof=pending rejected approved borrowed returned"`
		StartDate time.Time          `form:"start_date" time_format:"2006-01-02"`
		EndDate   time.Time          `form:"end_date"   time_format:"2006-01-02"`
		PaginationQuery
		SortQuery
	}

	BorrowResponse struct {
		ID           uint               `json:"id"`
		User         *UserResponse      `json:"user"`
		ReviewedUser *UserResponse      `json:"reviewedUser"`
		Item         *ItemResponse      `json:"item"`
		Purpose      string             `json:"purpose"`
		Quantity     int                `json:"quantity"`
		OfficerNote  *string            `json:"officerNote"`
		BorrowDate   time.Time          `json:"borrowDate"`
		ReturnDate   time.Time          `json:"returnDate"`
		Status       model.BorrowStatus `json:"status"`
		ReviewAt     *time.Time         `json:"reviewAt"`
		CreatedAt    time.Time          `json:"createdAt"`
		UpdatedAt    time.Time          `json:"updatedAt"`
	}

	BorrowRequest struct {
		ItemID     uint            `json:"itemId" binding:"required,gt=0"`
		Quantity   int             `json:"quantity" form:"quantity" binding:"required,gt=0"`
		Purpose    string          `json:"purpose" form:"purpose" binding:"required"`
		BorrowDate *types.DateOnly `json:"borrowDate" binding:"required" time_format:"2006-01-02"`
		ReturnDate *types.DateOnly `json:"returnDate" binding:"required" time_format:"2006-01-02"`
	}

	BorrowForUserRequest struct {
		BorrowRequest
		UserID uint `json:"userId" binding:"required,gt=0"`
	}

	BorrowApprovalRequest struct {
		OfficerNote *string `json:"officerNote"`
	}

	BorrowCardResponse struct {
		TotalPending  int64 `json:"totalPending"`
		TotalApproved int64 `json:"totalApproved"`
		TotalRejected int64 `json:"totalRejected"`
	}
)

func (bq *BorrowQuery) SetDefaults() {
	bq.PaginationQuery.SetDefaults()
	bq.SortQuery.SetDefaults(OrderDesc, OrderCreatedAt)
}
