package repository

import (
	"context"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"gorm.io/gorm"
)

type LogActivityRepository struct {
	db *gorm.DB
}

func NewLogActivityRepository(db *gorm.DB) *LogActivityRepository {
	return &LogActivityRepository{db: db}
}

func (r *LogActivityRepository) WithTx(tx *gorm.DB) *LogActivityRepository {
	return &LogActivityRepository{db: tx}
}

func (r *LogActivityRepository) Create(ctx context.Context, log *model.LogActivity) error {
	return r.db.WithContext(ctx).Create(log).Error
}

func (r *LogActivityRepository) FindAll(ctx context.Context, req dto.LogQuery) ([]model.LogActivity, int64, error) {
	var logs []model.LogActivity
	var total int64

	db := r.db.WithContext(ctx).Preload("User").Model(&model.LogActivity{})

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(string(req.OrderBy) + " " + string(req.Order))

	db = db.Offset(req.GetOffset()).Limit(req.Size)

	if err := db.Find(&logs).Error; err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}
