package dto

type OrderByType string

const (
	OrderCreatedAt OrderByType = "created_at"
	OrderUpdatedAt OrderByType = "updated_at"
)

type OrderType string

const (
	OrderDesc OrderType = "desc"
	OrderAsc  OrderType = "asc"
)

type SortQuery struct {
	Order   OrderType   `form:"order" json:"order" binding:"omitempty,oneof=asc desc"`
	OrderBy OrderByType `form:"orderBy" json:"orderBy" binding:"omitempty,oneof=created_at updated_at"`
}

func (sq *SortQuery) SetDefaults(order OrderType, orderBy OrderByType) {
	if sq.Order == "" {
		sq.Order = order
	}

	if sq.OrderBy == "" {
		sq.OrderBy = orderBy
	}
}
