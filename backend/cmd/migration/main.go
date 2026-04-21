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
		&model.Borrow{},
		&model.Return{},
		&model.LogActivity{},
	}

	if err := db.AutoMigrate(models...); err != nil {
		log.Fatal("Migration failed:", err.Error())
	}

	log.Println("Successfully migrate all tables")
}
