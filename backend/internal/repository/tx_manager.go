package repository

import (
	"context"

	"gorm.io/gorm"
)

type TxManager struct {
	db *gorm.DB
}

func NewTxManager(db *gorm.DB) *TxManager {
	return &TxManager{
		db: db,
	}
}

func (t *TxManager) Transaction(ctx context.Context, fn func(tx *gorm.DB) error) error {
	tx := t.db.WithContext(ctx).Begin()

	if tx.Error != nil {
		return tx.Error
	}

	if err := fn(tx); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
