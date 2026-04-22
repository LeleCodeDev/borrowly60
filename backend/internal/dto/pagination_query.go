package dto

type PaginationQuery struct {
	Page int `form:"page" json:"page" binding:"omitempty,gt=0"`
	Size int `form:"size" json:"size" binding:"omitempty,gt=0"`
}

func (pq *PaginationQuery) SetDefaults() {
	if pq.Page < 1 {
		pq.Page = 1
	}

	if pq.Size < 1 {
		pq.Size = 10
	}
}

func (pq *PaginationQuery) GetOffset() int {
	return (pq.Page - 1) * pq.Size
}
