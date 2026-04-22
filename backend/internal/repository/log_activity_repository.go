package repository

import (
	"context"

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
