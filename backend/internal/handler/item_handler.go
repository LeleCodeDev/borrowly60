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

type ItemHandler struct {
	service *service.ItemService
}

func NewItemHandler(service *service.ItemService) *ItemHandler {
	return &ItemHandler{
		service: service,
	}
}

func (h *ItemHandler) GetAllItems(c *gin.Context) {
	var req dto.ItemQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()

	items, total, err := h.service.GetAll(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	if req.Unpage {
		response.Success(c, http.StatusOK, "All items successfully fetched", items)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All items successfully fetched", items, pagination)
}

func (h *ItemHandler) GetItemByID(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()

	item, err := h.service.GetByID(ctx, uint(id))
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Item successfully fetched", item)
}

func (h *ItemHandler) GetItemCard(c *gin.Context) {
	ctx := c.Request.Context()

	dashboardData, err := h.service.GetCardData(ctx)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Item dashboard data successfully fetched", dashboardData)
}

func (h *ItemHandler) CreateItem(c *gin.Context) {
	var req dto.ItemCreateRequest

	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	file, _ := c.FormFile("image")
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	item, err := h.service.Create(ctx, currentUser, req, file)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Item successfully created", item)
}

func (h *ItemHandler) UpdateItem(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	var req dto.ItemUpdateRequest
	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	file, _ := c.FormFile("image")
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	item, err := h.service.Update(ctx, uint(id), currentUser, req, file)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Item successfully updated", item)
}

func (h *ItemHandler) DeleteItem(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	if err := h.service.Delete(ctx, currentUser, uint(id)); err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success[any](c, http.StatusOK, "Item successfully deleted", nil)
}
