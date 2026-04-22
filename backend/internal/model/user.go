package model

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleBorrower UserRole = "borrower"
	RoleOfficer  UserRole = "officer"
)

type User struct {
	ID        uint     `gorm:"primaryKey"`
	Username  string   `gorm:"not null;index"`
	Email     string   `gorm:"not null;unique;index"`
	Password  string   `gorm:"not null"`
	Phone     string   `gorm:"not null"`
	Role      UserRole `gorm:"type:enum('admin', 'officer', 'borrower');default:borrower;not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
