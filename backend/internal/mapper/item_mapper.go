package mapper

import (
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToItemResponse(item *model.Item) dto.ItemResponse {
	var category *dto.CategoryResponse
	if item.Category.ID != 0 {
		categoryResponse := ToCategoryResponse(&item.Category)
		category = &categoryResponse
	}

	return dto.ItemResponse{
		ID:          item.ID,
		Name:        item.Name,
		Description: item.Description,
		Category:    category,
		Quantity:    item.Quantity,
		Image:       item.Image,
		Status:      item.Status,
		CreatedAt:   item.CreatedAt,
		UpdatedAt:   item.UpdatedAt,
	}
}

func ToItemModel(req dto.ItemCreateRequest, category model.Category, filename *string) *model.Item {
	return &model.Item{
		Name:        req.Name,
		Description: req.Description,
		CategoryID:  category.ID,
		Category:    category,
		Quantity:    *req.Quantity,
		Image:       filename,
		Status:      model.ItemStatusAvailable,
	}
}

func UpdateItemModel(item *model.Item, req dto.ItemUpdateRequest, status model.ItemStatus, category model.Category, filename *string) {
	item.Name = req.Name
	item.Description = req.Description
	item.Category = category
	item.CategoryID = category.ID
	item.Quantity = *req.Quantity
	item.Image = filename
	item.Status = status
}
