// Package bootstrap
package bootstrap

import (
	"reflect"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/lelecodedev/borrowly/internal/database"
	"github.com/lelecodedev/borrowly/internal/handler"
	"github.com/lelecodedev/borrowly/internal/middleware"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/internal/service"
	"gorm.io/gorm"
)

type App struct {
	Router           *gin.Engine
	DB               *gorm.DB
	AuthMiddleware   gin.HandlerFunc
	AuthHandler      *handler.AuthHandler
	UserHandler      *handler.UserHandler
	CategoryHandler  *handler.CategoryHandler
	ItemHandler      *handler.ItemHandler
	BorrowHandler    *handler.BorrowHandler
	LogHandler       *handler.LogHandler
	ReturnHandler    *handler.ReturnHandler
	DashboardHandler *handler.DashboardHandler
}

func NewApp() *App {
	setupValidator()

	r := gin.Default()
	db := database.NewDB()
	txManager := repository.NewTxManager(db)

	userRepo := repository.NewUserRepository(db)
	logRepo := repository.NewLogActivityRepository(db)
	categoryRepo := repository.NewCategoryRepository(db)
	itemRepo := repository.NewItemRepository(db)
	borrowRepo := repository.NewBorrowRepository(db)
	returnRepo := repository.NewReturnRepository(db)

	logService := service.NewLogService(logRepo)
	userService := service.NewUserService(txManager, userRepo, logRepo)
	authService := service.NewAuthService(txManager, userRepo)
	categoryService := service.NewCategoryService(txManager, categoryRepo, itemRepo, borrowRepo, logRepo)
	itemService := service.NewItemService(txManager, itemRepo, categoryRepo, logRepo)
	borrowService := service.NewBorrowService(txManager, borrowRepo, itemRepo, userRepo, logRepo, returnRepo)
	returnService := service.NewReturnService(txManager, returnRepo, borrowRepo, itemRepo, logRepo)
	dashboardService := service.NewDashboardService(itemRepo, categoryRepo, userRepo, borrowRepo, returnRepo)

	app := &App{
		Router:           r,
		DB:               db,
		AuthMiddleware:   middleware.AuthMiddleware(userRepo),
		UserHandler:      handler.NewUserHandler(userService),
		AuthHandler:      handler.NewAuthHandler(authService),
		CategoryHandler:  handler.NewCategoryHandler(categoryService),
		ItemHandler:      handler.NewItemHandler(itemService),
		BorrowHandler:    handler.NewBorrowHandler(borrowService),
		LogHandler:       handler.NewLogHandler(logService),
		ReturnHandler:    handler.NewReturnHandler(returnService),
		DashboardHandler: handler.NewDashboardHandler(dashboardService),
	}

	app.Router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: false,
	}))

	app.RegisterRoute()

	return app
}

func (a *App) Run(addr string) error {
	err := a.Router.Run(addr)
	return err
}

func setupValidator() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterTagNameFunc(func(field reflect.StructField) string {
			name := strings.SplitN(field.Tag.Get("json"), ",", 2)[0]
			return name
		})
	}
}
