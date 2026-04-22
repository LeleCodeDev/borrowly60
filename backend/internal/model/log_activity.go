package model

import "time"

type LogActivity struct {
	ID        uint   `gorm:"primaryKey"`
	UserID    *uint  `gorm:"index"`
	User      *User  `gorm:"constraint:OnDelete:SET NULL"`
	Activity  string `gorm:"not null"`
	CreatedAt time.Time
}
