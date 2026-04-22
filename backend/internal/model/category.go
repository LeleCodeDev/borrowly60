package model

import (
	"time"

	"gorm.io/gorm"
)

type Category struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"type:varchar(255);not null;uniqueIndex:idx_name_deleted_at;index"`
	Description string `gorm:"not null;type:text"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index;uniqueIndex:idx_name_deleted_at"`
}
