package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/service"
	"github.com/lelecodedev/borrowly/pkg/response"
)

type DashboardHandler struct {
	service *service.DashboardService
}

func NewDashboardHandler(dashboardService *service.DashboardService) *DashboardHandler {
	return &DashboardHandler{
		service: dashboardService,
	}
}

func (h *DashboardHandler) GetAdminDashboard(c *gin.Context) {
	ctx := c.Request.Context()

	dashboardData, err := h.service.GetAdminDashboard(ctx)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Admin dashboard data successfully fetched", dashboardData)
}

func (h *DashboardHandler) GetOfficerDashboard(c *gin.Context) {
	ctx := c.Request.Context()

	dashboardData, err := h.service.GetOfficerDashboard(ctx)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Officer dashboard data successfully fetched", dashboardData)
}

func (h *DashboardHandler) GetBorrowerDashboard(c *gin.Context) {
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	dashboardData, err := h.service.GetBorrowerDashboard(ctx, currentUser)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrower dashboard data successfully fetched", dashboardData)
}
