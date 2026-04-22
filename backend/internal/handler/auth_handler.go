package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/service"
	"github.com/lelecodedev/borrowly/pkg/response"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(service *service.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest

	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()

	auth, err := h.service.Register(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Registered sucessfull!", auth)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest

	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()

	auth, err := h.service.Login(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Login sucessfull!", auth)
}

func (h *AuthHandler) GetUserProfile(c *gin.Context) {
	currentUser := c.MustGet("user").(model.User)

	user := h.service.GetProfile(currentUser)

	response.Success(c, http.StatusOK, "User profile successfully fetched", user)
}
