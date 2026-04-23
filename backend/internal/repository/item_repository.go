package repository

import (
	"context"
	"errors"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"gorm.io/gorm"
)

type ItemRepository struct {
	db *gorm.DB
}

func NewItemRepository(db *gorm.DB) *ItemRepository {
	return &ItemRepository{
		db: db,
	}
}

func (r *ItemRepository) WithTx(tx *gorm.DB) *ItemRepository {
	return &ItemRepository{db: tx}
}

func (r *ItemRepository) Create(ctx context.Context, item *model.Item) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *ItemRepository) Update(ctx context.Context, item *model.Item) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *ItemRepository) FindAll(ctx context.Context, req dto.ItemQuery) ([]model.Item, int64, error) {
	var items []model.Item
	var total int64

	db := r.db.WithContext(ctx).Preload("Category").Model(&model.Item{})

	if req.Search != "" {
		db = db.Where("name LIKE ?", "%"+req.Search+"%")
	}

	if req.Status != "" {
		db = db.Where("status = ?", req.Status)
	}

	if req.CategoryID > 0 {
		db = db.Where("category_id = ?", req.CategoryID)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(string(req.OrderBy) + " " + string(req.Order))

	if !req.Unpage {
		db = db.Offset(req.GetOffset()).Limit(req.Size)
	}

	if err := db.Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

func (r *ItemRepository) FindByID(ctx context.Context, id uint) (*model.Item, error) {
	var item model.Item

	if err := r.db.WithContext(ctx).Preload("Category").First(&item, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &item, nil
}

func (r *ItemRepository) ExistByName(ctx context.Context, name string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Item{}).Where("name COLLATE utf8mb4_bin = ?", name).Count(&count).Error
	return count > 0, err
}

func (r *ItemRepository) Delete(ctx context.Context, item *model.Item) error {
	return r.db.WithContext(ctx).Delete(item).Error
}

func (r *ItemRepository) DeleteByCategoryID(ctx context.Context, catgoryID uint) error {
	return r.db.WithContext(ctx).Where("category_id = ?", catgoryID).Delete(&model.Item{}).Error
}

func (r *ItemRepository) CountAll(ctx context.Context) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&model.Item{}).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *ItemRepository) CountByStatus(ctx context.Context, status model.ItemStatus) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&model.Item{}).
		Where("status = ?", status).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}
