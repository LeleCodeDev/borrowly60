package model

import (
	"time"

	"gorm.io/gorm"
)

type Return struct {
	ID               uint      `gorm:"primaryKey"`
	BorrowID         uint      `gorm:"not null;index"`
	Borrow           Borrow    `gorm:"constraint:OnDelete:CASCADE"`
	ActualReturnDate time.Time `gorm:"type:date;not null"`
	BorrowerNote     *string   `gorm:"type:text"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
	DeletedAt        gorm.DeletedAt `gorm:"index"`
}
