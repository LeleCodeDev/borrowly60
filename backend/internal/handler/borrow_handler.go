package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/service"
	"github.com/lelecodedev/borrowly/internal/util"
	"github.com/lelecodedev/borrowly/pkg/pagination"
	"github.com/lelecodedev/borrowly/pkg/response"
)

type BorrowHandler struct {
	Service *service.BorrowService
}

func NewBorrowHandler(service *service.BorrowService) *BorrowHandler {
	return &BorrowHandler{
		Service: service,
	}
}

func (h *BorrowHandler) GetAllBorrows(c *gin.Context) {
	var req dto.BorrowQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()

	borrows, total, err := h.Service.GetAll(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All borrows successfully fetched", borrows, pagination)
}

func (h *BorrowHandler) GetAllBorrowsByUser(c *gin.Context) {
	var req dto.BorrowQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrows, total, err := h.Service.GetAllByUser(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All borrows successfully fetched", borrows, pagination)
}

func (h *BorrowHandler) GetBorrowCard(c *gin.Context) {
	ctx := c.Request.Context()

	dashboardData, err := h.Service.GetCardData(ctx)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow dashboard data successfully fetched", dashboardData)
}

func (h *BorrowHandler) GetBorrowCardByUser(c *gin.Context) {
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	cardData, err := h.Service.GetCardDataByUser(ctx, currentUser)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow dashboard data successfully fetched", cardData)
}

func (h *BorrowHandler) CreateBorrow(c *gin.Context) {
	var req dto.BorrowRequest

	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Create(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Borrow successfully created", borrow)
}

func (h *BorrowHandler) CreateBorrowForUser(c *gin.Context) {
	var req dto.BorrowForUserRequest

	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.CreateForUser(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Borrow successfully created", borrow)
}

func (h *BorrowHandler) UpdateBorrowForUser(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	var req dto.BorrowRequest
	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.UpdateForUser(ctx, req, id, currentUser)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully updated", borrow)
}

func (h *BorrowHandler) ApproveBorrow(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	var req dto.BorrowApprovalRequest
	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Approve(ctx, currentUser, id, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully approved", borrow)
}

func (h *BorrowHandler) RejectBorrow(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	var req dto.BorrowApprovalRequest
	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Reject(ctx, currentUser, id, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully rejected", borrow)
}

func (h *BorrowHandler) CancelBorrow(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}
	ctx := c.Request.Context()
	currentUSer := c.MustGet("user").(model.User)

	borrow, err := h.Service.Cancel(ctx, currentUSer, id)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully canceled", borrow)
}

func (h *BorrowHandler) ConfirmBorrow(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Confirm(ctx, currentUser, id)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully confirmed", borrow)
}

func (h *BorrowHandler) ReturnedBorrow(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	var req dto.ReturnRequest
	if err := c.ShouldBind(&req); err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Return(ctx, currentUser, id, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully returned", borrow)
}

func (h *BorrowHandler) DeleteBorrow(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	if err := h.Service.Delete(ctx, id, currentUser); err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success[any](c, http.StatusOK, "Borrow successfully deleted", nil)
}

func (h *BorrowHandler) GenerateBorrowPDF(c *gin.Context) {
	var req dto.BorrowQuery
	if err := c.ShouldBindQuery(&req); err != nil {
		response.HandleError(c, err)
		return
	}
	req.SetDefaults()

	ctx := c.Request.Context()
	pdfBytes, err := h.Service.GeneratePDF(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	var filename string
	if !req.StartDate.IsZero() && !req.EndDate.IsZero() {
		filename = fmt.Sprintf("Borrow Report from %v to %v", req.StartDate.Format("2006-01-02"), req.EndDate.Format("2006-01-02"))
	} else if !req.StartDate.IsZero() {
		filename = fmt.Sprintf("Borrow Report from %v", req.StartDate.Format("2006-01-02"))
	} else {
		filename = "Borrow Report"
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%q", filename))
	c.Header("Content-Length", fmt.Sprintf("%d", len(pdfBytes)))

	c.Data(http.StatusOK, "application/pdf", pdfBytes)
}
