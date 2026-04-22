package dto

import (
	"time"
)

type (
	LogQuery struct {
		PaginationQuery
		SortQuery
	}

	LogResponse struct {
		ID        uint          `json:"id"`
		User      *UserResponse `json:"user"`
		Activity  string        `json:"activity"`
		CreatedAt time.Time     `json:"createdAt"`
	}
)

func (lq *LogQuery) SetDefaults() {
	lq.PaginationQuery.SetDefaults()
	lq.SortQuery.SetDefaults(OrderDesc, OrderCreatedAt)
	lq.OrderBy = "created_at"
}
