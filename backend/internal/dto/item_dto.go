package dto

import (
	"time"

	"github.com/lelecodedev/borrowly/internal/model"
)

type (
	ItemQuery struct {
		Search     string           `form:"search"`
		CategoryID uint             `form:"categoryId" json:"categoryId" binding:"omitempty,gt=0"`
		Status     model.ItemStatus `form:"status" json:"status" binding:"omitempty,oneof=available unavailable"`
		Unpage     bool             `form:"unpage"`
		PaginationQuery
		SortQuery
	}

	ItemResponse struct {
		ID          uint              `json:"id"`
		Name        string            `json:"name"`
		Description string            `json:"description"`
		Category    *CategoryResponse `json:"category"`
		Quantity    int               `json:"quantity"`
		Image       *string           `json:"image"`
		Status      model.ItemStatus  `json:"status"`
		CreatedAt   time.Time         `json:"createdAt"`
		UpdatedAt   time.Time         `json:"updatedAt"`
	}

	ItemCreateRequest struct {
		Name        string `json:"name" form:"name" binding:"required"`
		Description string `json:"description" form:"description" binding:"required"`
		CategoryID  uint   `json:"categoryId" form:"categoryId" binding:"required,gt=0"`
		Quantity    *int   `json:"quantity" form:"quantity" binding:"required,gt=0"`
	}

	ItemUpdateRequest struct {
		Name        string `json:"name" form:"name" binding:"required"`
		Description string `json:"description" form:"description" binding:"required"`
		CategoryID  uint   `json:"categoryId" form:"categoryId" binding:"required,gt=0"`
		Quantity    *int   `json:"quantity" form:"quantity" binding:"required"`
	}

	ItemCardResponse struct {
		AvailableItems   int64 `json:"availableItems"`
		UnavailableItems int64 `json:"unavailableItems"`
	}
)

func (iq *ItemQuery) SetDefaults() {
	iq.PaginationQuery.SetDefaults()
	iq.SortQuery.SetDefaults(OrderAsc, OrderCreatedAt)
}
