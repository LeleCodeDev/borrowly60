package dto

import (
	"time"

	"github.com/lelecodedev/borrowly/internal/model"
)

type (
	UserQuery struct {
		Search string         `form:"search"`
		Role   model.UserRole `json:"role" form:"role" binding:"omitempty,oneof=borrower officer"`
		Unpage bool           `form:"unpage"`
		PaginationQuery
		SortQuery
	}

	UserCreateRequest struct {
		Username string         `json:"username" form:"username" binding:"required"`
		Email    string         `json:"email" form:"email" binding:"required,email"`
		Password string         `json:"password" form:"password" binding:"required,min=8"`
		Phone    string         `json:"phone" form:"phone" binding:"required,min=11,max=11"`
		Role     model.UserRole `json:"role" form:"role" binding:"required,oneof=borrower officer"`
	}

	UserUpdateRequest struct {
		Username string         `json:"username" form:"username" binding:"required"`
		Phone    string         `json:"phone" form:"phone" binding:"required,min=11,max=11"`
		Role     model.UserRole `json:"role" form:"role" binding:"required,oneof=borrower officer"`
	}

	UserResponse struct {
		ID        uint           `json:"id"`
		Username  string         `json:"username"`
		Email     string         `json:"email"`
		Phone     string         `json:"phone"`
		Role      model.UserRole `json:"role"`
		CreatedAt time.Time      `json:"createdAt"`
		UpdatedAt time.Time      `json:"updatedAt"`
	}

	UserCardResponse struct {
		TotalBorrowers int64 `json:"totalBorrowers"`
		TotalOfficers  int64 `json:"totalOfficers"`
	}
)

func (uq *UserQuery) SetDefaults() {
	uq.PaginationQuery.SetDefaults()
	uq.SortQuery.SetDefaults(OrderDesc, OrderCreatedAt)
}
