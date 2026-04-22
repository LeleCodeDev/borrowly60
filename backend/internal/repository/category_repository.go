package repository

import (
	"context"
	"errors"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{
		db: db,
	}
}

func (r *CategoryRepository) FindAll(ctx context.Context, req dto.CategoryQuery) ([]model.Category, int64, error) {
	var categories []model.Category
	var total int64

	db := r.db.WithContext(ctx).Model(&model.Category{})

	if req.Search != "" {
		db = db.Where("name LIKE ?", "%"+req.Search+"%")
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(string(req.OrderBy) + " " + string(req.Order))

	if !req.Unpage {
		db = db.Offset(req.GetOffset()).Limit(req.Size)
	}

	if err := db.Find(&categories).Error; err != nil {
		return nil, 0, err
	}

	return categories, total, nil
}

func (r *CategoryRepository) FindByID(ctx context.Context, id uint) (*model.Category, error) {
	var category model.Category

	if err := r.db.WithContext(ctx).First(&category, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &category, nil
}

func (r *CategoryRepository) ExistByName(ctx context.Context, name string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Category{}).Where("name = ?", name).Count(&count).Error
	return count > 0, err
}

func (r *CategoryRepository) Create(ctx context.Context, category *model.Category) error {
	return r.db.WithContext(ctx).Create(category).Error
}

func (r *CategoryRepository) Update(ctx context.Context, category *model.Category) error {
	return r.db.WithContext(ctx).Save(category).Error
}

func (r *CategoryRepository) WithTx(tx *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: tx}
}

func (r *CategoryRepository) Delete(ctx context.Context, category *model.Category) error {
	return r.db.WithContext(ctx).Delete(category).Error
}

func (r *CategoryRepository) CountAll(ctx context.Context) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&model.Category{}).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}
