package main

import (
	"log"

	"github.com/lelecodedev/borrowly/internal/config"
	"github.com/lelecodedev/borrowly/internal/database"
	"github.com/lelecodedev/borrowly/internal/model"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func init() {
	config.LoadConfig()
}

func main() {
	db := database.NewDB()

	seedAdmin(db)

	log.Println("Seed successfull!")
}

func seedAdmin(db *gorm.DB) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin#1234"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to seed admin", err.Error())
	}

	admin := &model.User{
		Username: "Admin",
		Email:    "admin@email.xyz",
		Password: string(hashedPassword),
		Phone:    "000000000",
		Role:     model.RoleAdmin,
	}

	if err := db.FirstOrCreate(admin, model.User{Email: admin.Email}).Error; err != nil {
		log.Fatal("Failed to seed admin", err.Error())
	}
}
