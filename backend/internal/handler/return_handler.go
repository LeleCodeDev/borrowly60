// Package handler
package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/service"
	"github.com/lelecodedev/borrowly/internal/util"
	"github.com/lelecodedev/borrowly/pkg/pagination"
	"github.com/lelecodedev/borrowly/pkg/response"
)

type ReturnHandler struct {
	service *service.ReturnService
}

func NewReturnHandler(service *service.ReturnService) *ReturnHandler {
	return &ReturnHandler{
		service: service,
	}
}

func (h *ReturnHandler) GetAllReturns(c *gin.Context) {
	var req dto.ReturnQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()

	returns, total, err := h.service.GetAll(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All returns successfully fetched", returns, pagination)
}

func (h *ReturnHandler) GetAllReturnsByUser(c *gin.Context) {
	var req dto.ReturnQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	returns, total, err := h.service.GetAllByUser(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All returns successfully fetched", returns, pagination)
}

func (h *ReturnHandler) GetReturnCard(c *gin.Context) {
	ctx := c.Request.Context()

	dashboardData, err := h.service.GetCardData(ctx)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Return dashboard data successfully fetched", dashboardData)
}

func (h *ReturnHandler) GetReturnCardByUser(c *gin.Context) {
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	cardData, err := h.service.GetCardDataByUser(ctx, currentUser)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Return dashboard data successfully fetched", cardData)
}

func (h *ReturnHandler) CreateReturnForUser(c *gin.Context) {
	var req dto.ReturnCreateForUserRequest

	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	returnBorrow, err := h.service.CreateForUser(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Return successfully created", returnBorrow)
}

func (h *ReturnHandler) UpdateReturnForUser(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	var req dto.ReturnUpdateForUserRequest

	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	returnBorrow, err := h.service.UpdateForUser(ctx, id, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Return successfully updated", returnBorrow)
}

func (h *ReturnHandler) DeleteReturn(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	if err := h.service.Delete(ctx, id, currentUser); err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success[any](c, http.StatusOK, "Return successfully deleted", nil)
}
