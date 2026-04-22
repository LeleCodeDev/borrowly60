package model

import (
	"time"

	"gorm.io/gorm"
)

type BorrowStatus string

const (
	BorrowStatusPending  BorrowStatus = "pending"
	BorrowStatusRejected BorrowStatus = "rejected"
	BorrowStatusApproved BorrowStatus = "approved"
	BorrowStatusBorrowed BorrowStatus = "borrowed"
	BorrowStatusReturned BorrowStatus = "returned"
	BorrowStatusCanceled BorrowStatus = "canceled"
)

type Borrow struct {
	ID             uint         `gorm:"primaryKey"`
	UserID         uint         `gorm:"not null;index"`
	User           User         `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	ReviewedUserID *uint        `gorm:"index"`
	ReviewedUser   *User        `gorm:"foreignKey:ReviewedUserID;constraint:OnDelete:SET NULL"`
	ItemID         uint         `gorm:"not null;index"`
	Item           Item         `gorm:"constraint:OnDelete:CASCADE"`
	purpose        string       `gorm:"not null"`
	Quantity       int          `gorm:"not null"`
	OfficerNote    *string      `gorm:"type:text"`
	BorrowDate     time.Time    `gorm:"type:date;not null"`
	ReturnDate     time.Time    `gorm:"type:date;not null"`
	Status         BorrowStatus `gorm:"type:enum('pending', 'rejected', 'approved', 'borrowed', 'returned', 'canceled');default:pending;not null"`
	ReviewAt       *time.Time   `gorm:"type:date"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      gorm.DeletedAt `gorm:"index"`
}
