// Package mapper
package mapper

import (
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToCategoryResponse(category *model.Category) dto.CategoryResponse {
	return dto.CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		Description: category.Description,
		CreatedAt:   category.CreatedAt,
		UpdatedAt:   category.UpdatedAt,
	}
}

func ToCategoryModel(req dto.CategoryRequest) *model.Category {
	return &model.Category{
		Name:        req.Name,
		Description: req.Description,
	}
}

func UpdateCategoryModel(category *model.Category, req dto.CategoryRequest) {
	category.Name = req.Name
	category.Description = req.Description
}
