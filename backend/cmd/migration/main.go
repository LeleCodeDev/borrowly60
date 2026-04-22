package main

import (
	"log"

	"github.com/lelecodedev/borrowly/internal/config"
	"github.com/lelecodedev/borrowly/internal/database"
	"github.com/lelecodedev/borrowly/internal/model"
)

func init() {
	config.LoadConfig()
}

func main() {
	db := database.NewDB()

	models := []any{
		&model.User{},
		&model.Category{},
		&model.Item{},
		&model.LogActivity{},
		&model.Borrow{},
		&model.Return{},
	}

	if err := db.AutoMigrate(models...); err != nil {
		log.Fatal("Failed to migrate table", err.Error())
	}

	log.Println("All table migrate successfully!")
}
