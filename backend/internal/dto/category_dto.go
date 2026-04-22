package dto

import (
	"time"
)

type (
	CategoryQuery struct {
		Search string `form:"search"`
		Unpage bool   `form:"unpage"`
		PaginationQuery
		SortQuery
	}

	CategoryResponse struct {
		ID          uint      `json:"id"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
		CreatedAt   time.Time `json:"createdAt"`
		UpdatedAt   time.Time `json:"updatedAt"`
	}

	CategoryRequest struct {
		Name        string `json:"name" form:"name" binding:"required"`
		Description string `json:"description" form:"description" binding:"required"`
	}
)

func (cq *CategoryQuery) SetDefaults() {
	cq.PaginationQuery.SetDefaults()
	cq.SortQuery.SetDefaults(OrderAsc, OrderCreatedAt)
}
