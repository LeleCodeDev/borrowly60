package repository

import (
	"context"
	"errors"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"gorm.io/gorm"
)

type BorrowRepository struct {
	db *gorm.DB
}

func NewBorrowRepository(db *gorm.DB) *BorrowRepository {
	return &BorrowRepository{db: db}
}

func (r *BorrowRepository) WithTx(tx *gorm.DB) *BorrowRepository {
	return &BorrowRepository{db: tx}
}

func (r *BorrowRepository) FindAll(ctx context.Context, req dto.BorrowQuery) ([]model.Borrow, int64, error) {
	var borrows []model.Borrow
	var total int64

	db := r.db.WithContext(ctx).
		Preload("User").
		Preload("ReviewedUser").
		Preload("Item").
		Preload("Item.Category").
		Model(&model.Borrow{})

	if req.Status != "" {
		db = db.Where("status = ?", req.Status)
	}

	if !req.StartDate.IsZero() {
		db = db.Where("borrow_date >= ?", req.StartDate)
	}

	if !req.EndDate.IsZero() {
		db = db.Where("borrow_date <= ?", req.EndDate)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(string(req.OrderBy) + " " + string(req.Order))

	db = db.Offset(req.GetOffset()).Limit(req.Size)

	if err := db.Find(&borrows).Error; err != nil {
		return nil, 0, err
	}

	return borrows, total, nil
}

func (r *BorrowRepository) ExistActiveByItemCategoryID(ctx context.Context, catagoryID uint) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.Borrow{}).
		Joins("JOIN items ON items.id = borrows.item_id AND items.deleted_at IS NULL").
		Joins("JOIN categories ON categories.id = items.category_id AND categories.deleted_at IS NULL").
		Where("categories.id = ?", catagoryID).
		Where("borrows.status = ? OR borrows.status = ?", model.BorrowStatusApproved, model.BorrowStatusBorrowed).
		Count(&count).Error
	return count > 0, err
}

func (r *BorrowRepository) ExistActiveByItemID(ctx context.Context, itemID uint) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.Borrow{}).
		Joins("JOIN items ON items.id = borrows.item_id AND items.deleted_at IS NULL").
		Where("items.id = ?", itemID).
		Where("borrows.status = ? OR borrows.status = ?", model.BorrowStatusApproved, model.BorrowStatusBorrowed).
		Count(&count).Error
	return count > 0, err
}

func (r *BorrowRepository) FindAllByUserID(ctx context.Context, userID uint, req dto.BorrowQuery) ([]model.Borrow, int64, error) {
	var borrows []model.Borrow
	var total int64

	db := r.db.WithContext(ctx).
		Preload("User").
		Preload("ReviewedUser").
		Preload("Item").
		Preload("Item.Category").
		Model(&model.Borrow{})

	db = db.Where("user_id = ?", userID)

	if req.Status != "" {
		db = db.Where("status = ?", req.Status)
	}

	if !req.StartDate.IsZero() {
		db = db.Where("borrow_date >= ?", req.StartDate)
	}

	if !req.EndDate.IsZero() {
		db = db.Where("borrow_date <= ?", req.EndDate)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(string(req.OrderBy) + " " + string(req.Order))

	db = db.Offset(req.GetOffset()).Limit(req.Size)

	if err := db.Find(&borrows).Error; err != nil {
		return nil, 0, err
	}

	return borrows, total, nil
}

func (r *BorrowRepository) FindByID(ctx context.Context, id uint) (*model.Borrow, error) {
	var borrow model.Borrow

	if err := r.db.WithContext(ctx).
		Preload("User").
		Preload("ReviewedUser").
		Preload("Item").
		Preload("Item.Category").
		First(&borrow, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &borrow, nil
}

func (r *BorrowRepository) Create(ctx context.Context, borrow *model.Borrow) error {
	return r.db.WithContext(ctx).Create(borrow).Error
}

func (r *BorrowRepository) Update(ctx context.Context, borrow *model.Borrow) error {
	return r.db.WithContext(ctx).Save(borrow).Error
}

func (r *BorrowRepository) CountByStatus(ctx context.Context, status model.BorrowStatus) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&model.Borrow{}).
		Where("status = ?", status).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *BorrowRepository) CountByStatusAndUserID(ctx context.Context, status model.BorrowStatus, userID uint) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&model.Borrow{}).
		Where("status = ?", status).
		Where("user_id = ?", userID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *BorrowRepository) Delete(ctx context.Context, borrow *model.Borrow) error {
	return r.db.WithContext(ctx).Delete(borrow).Error
}
