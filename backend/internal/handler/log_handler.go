package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/service"
	"github.com/lelecodedev/borrowly/pkg/pagination"
	"github.com/lelecodedev/borrowly/pkg/response"
)

type LogHandler struct {
	service *service.LogService
}

func NewLogHandler(service *service.LogService) *LogHandler {
	return &LogHandler{
		service: service,
	}
}

func (h *LogHandler) GetAllLogs(c *gin.Context) {
	var req dto.LogQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()

	logs, total, err := h.service.GetAll(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)

	response.Paginated(c, http.StatusOK, "All logs successfully fetched", logs, pagination)
}
