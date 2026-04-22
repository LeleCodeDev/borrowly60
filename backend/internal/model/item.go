package model

import (
	"time"

	"gorm.io/gorm"
)

type ItemStatus string

const (
	ItemStatusAvailable   ItemStatus = "available"
	ItemStatusUnavailable ItemStatus = "unavailable"
)

type Item struct {
	ID          uint       `gorm:"primaryKey"`
	Name        string     `gorm:"type:varchar(255);not null;uniqueIndex:idx_name_deleted_at;index"`
	Description string     `gorm:"not null;type:text"`
	CategoryID  uint       `gorm:"not null;index"`
	Category    Category   `gorm:"constraint:OnDelete:CASCADE"`
	Quantity    int        `gorm:"not null"`
	Image       *string    `gorm:"type:varchar(255)"`
	Status      ItemStatus `gorm:"not null;type:enum('available', 'unavailable');default:unavailable"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index;uniqueIndex:idx_name_deleted_at"`
}
