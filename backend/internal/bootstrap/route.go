package bootstrap

import (
	"github.com/lelecodedev/borrowly/internal/middleware"
	"github.com/lelecodedev/borrowly/internal/model"
)

func (a *App) RegisterRoute() {
	api := a.Router.Group("/api")

	api.Static("/uploads", "uploads")

	auth := api.Group("/auth")
	{
		auth.POST("/register", a.AuthHandler.Register)
		auth.POST("/login", a.AuthHandler.Login)
	}

	authenticated := api.Group("")
	authenticated.Use(a.AuthMiddleware)

	allRoles := authenticated.Group("")
	allRoles.Use(middleware.RoleMiddleware(model.RoleAdmin, model.RoleOfficer, model.RoleBorrower))
	{
		allRoles.GET("/categories", a.CategoryHandler.GetAllCategories)
		allRoles.GET("/categories/:id", a.CategoryHandler.GetCategoryByID)

		allRoles.GET("/items", a.ItemHandler.GetAllItems)
		allRoles.GET("/items/:id", a.ItemHandler.GetItemByID)

		allRoles.GET("/auth/me", a.AuthHandler.GetUserProfile)
	}

	adminAndOfficer := authenticated.Group("")
	adminAndOfficer.Use(middleware.RoleMiddleware(model.RoleAdmin, model.RoleOfficer))
	{
		adminAndOfficer.GET("/borrows", a.BorrowHandler.GetAllBorrows)
		adminAndOfficer.GET("/borrows/card", a.BorrowHandler.GetBorrowCard)

		adminAndOfficer.GET("/returns", a.ReturnHandler.GetAllReturns)
		adminAndOfficer.GET("/returns/card", a.ReturnHandler.GetReturnCard)
	}

	admin := authenticated.Group("")
	admin.Use(middleware.RoleMiddleware(model.RoleAdmin))
	{
		admin.GET("/logs", a.LogHandler.GetAllLogs)

		admin.GET("/admin/dashboard", a.DashboardHandler.GetAdminDashboard)

		admin.GET("/users", a.UserHandler.GetAllUsers)
		admin.GET("/users/:id", a.UserHandler.GetUserByID)
		admin.GET("/users/card", a.UserHandler.GetUserCard)
		admin.POST("/users", a.UserHandler.CreateUser)
		admin.PUT("/users/:id", a.UserHandler.UpdateUser)
		admin.DELETE("/users/:id", a.UserHandler.DeleteUser)

		admin.POST("/categories", a.CategoryHandler.CreateCategory)
		admin.PUT("/categories/:id", a.CategoryHandler.UpdateCategory)
		admin.DELETE("/categories/:id", a.CategoryHandler.DeleteCategory)

		admin.POST("/items", a.ItemHandler.CreateItem)
		admin.GET("/items/card", a.ItemHandler.GetItemCard)
		admin.PUT("/items/:id", a.ItemHandler.UpdateItem)
		admin.DELETE("/items/:id", a.ItemHandler.DeleteItem)

		admin.POST("/borrows", a.BorrowHandler.CreateBorrowForUser)
		admin.PUT("/borrows/:id", a.BorrowHandler.UpdateBorrowForUser)
		admin.DELETE("/borrows/:id", a.BorrowHandler.DeleteBorrow)

		admin.POST("/returns", a.ReturnHandler.CreateReturnForUser)
		admin.PUT("/returns/:id", a.ReturnHandler.UpdateReturnForUser)
		admin.DELETE("/returns/:id", a.ReturnHandler.DeleteReturn)
	}

	borrower := authenticated.Group("")
	borrower.Use(middleware.RoleMiddleware(model.RoleBorrower))
	{
		borrower.GET("/borrower/dashboard", a.DashboardHandler.GetAdminDashboard)

		borrower.GET("/my-borrows", a.BorrowHandler.GetAllBorrowsByUser)
		borrower.GET("/my-borrows/card", a.BorrowHandler.GetBorrowCardByUser)
		borrower.POST("/my-borrows", a.BorrowHandler.CreateBorrow)
		borrower.PUT("/my-borrows/:id/confirm", a.BorrowHandler.ConfirmBorrow)
		borrower.PUT("/my-borrows/:id/return", a.BorrowHandler.ReturnedBorrow)
		borrower.PUT("/my-borrows/:id/cancel", a.BorrowHandler.CancelBorrow)

		borrower.GET("/my-returns", a.ReturnHandler.GetAllReturnsByUser)
		borrower.GET("/my-returns/card", a.ReturnHandler.GetReturnCardByUser)
	}

	officer := authenticated.Group("")
	officer.Use(middleware.RoleMiddleware(model.RoleOfficer))
	{
		officer.GET("/officer/dashboard", a.DashboardHandler.GetOfficerDashboard)

		officer.PUT("/borrows/:id/approve", a.BorrowHandler.ApproveBorrow)
		officer.PUT("/borrows/:id/reject", a.BorrowHandler.RejectBorrow)
		officer.GET("/borrows/download-pdf", a.BorrowHandler.GenerateBorrowPDF)
	}
}
