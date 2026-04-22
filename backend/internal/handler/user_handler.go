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

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) GetAllUsers(c *gin.Context) {
	var req dto.UserQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()

	users, total, err := h.service.GetAll(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	if req.Unpage {
		response.Success(c, http.StatusOK, "All users successfully fetched", users)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All users successfully fetched", users, pagination)
}

func (h *UserHandler) GetUserByID(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()

	user, err := h.service.GetByID(ctx, id)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "User successfully fetched", user)
}

func (h *UserHandler) GetUserCard(c *gin.Context) {
	ctx := c.Request.Context()

	dashboardData, err := h.service.GetCardData(ctx)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "User dashboard data successfully fetched", dashboardData)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var req dto.UserCreateRequest

	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	user, err := h.service.Create(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "User successfully created", user)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	var req dto.UserUpdateRequest
	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	user, err := h.service.Update(ctx, id, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "User successfully updated", user)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	if err := h.service.Delete(ctx, currentUser, id); err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success[any](c, http.StatusOK, "User successfully deleted", nil)
}
