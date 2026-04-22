// Package service
package service

import (
	"bytes"
	"context"
	"fmt"
	"html/template"
	"time"

	"github.com/SebastiaanKlippert/go-wkhtmltopdf"
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/mapper"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/pkg/errors"
	"gorm.io/gorm"
)

type BorrowService struct {
	txManager  *repository.TxManager
	repo       *repository.BorrowRepository
	itemRepo   *repository.ItemRepository
	userRepo   *repository.UserRepository
	logRepo    *repository.LogActivityRepository
	returnRepo *repository.ReturnRepository
}

func NewBorrowService(
	txManager *repository.TxManager,
	repo *repository.BorrowRepository,
	itemRepo *repository.ItemRepository,
	userRepo *repository.UserRepository,
	logRepo *repository.LogActivityRepository,
	returnRepo *repository.ReturnRepository,
) *BorrowService {
	return &BorrowService{
		txManager:  txManager,
		repo:       repo,
		itemRepo:   itemRepo,
		userRepo:   userRepo,
		logRepo:    logRepo,
		returnRepo: returnRepo,
	}
}

func (s *BorrowService) GetAll(ctx context.Context, req dto.BorrowQuery) ([]dto.BorrowResponse, int64, error) {
	borrows, total, err := s.repo.FindAll(ctx, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.BorrowResponse, 0, len(borrows))

	for _, borrow := range borrows {
		responses = append(responses, mapper.ToBorrowResponse(&borrow))
	}

	return responses, total, nil
}

func (s *BorrowService) GetAllByUser(ctx context.Context, currentUser model.User, req dto.BorrowQuery) ([]dto.BorrowResponse, int64, error) {
	borrows, total, err := s.repo.FindAllByUserID(ctx, currentUser.ID, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.BorrowResponse, 0, len(borrows))

	for _, borrow := range borrows {
		responses = append(responses, mapper.ToBorrowResponse(&borrow))
	}

	return responses, total, nil
}

func (s *BorrowService) GetCardData(ctx context.Context) (dto.BorrowCardResponse, error) {
	totalPending, err := s.repo.CountByStatus(ctx, model.BorrowStatusPending)
	if err != nil {
		return dto.BorrowCardResponse{}, err
	}

	totalApproved, err := s.repo.CountByStatus(ctx, model.BorrowStatusApproved)
	if err != nil {
		return dto.BorrowCardResponse{}, err
	}

	totalRejected, err := s.repo.CountByStatus(ctx, model.BorrowStatusRejected)
	if err != nil {
		return dto.BorrowCardResponse{}, err
	}

	return dto.BorrowCardResponse{
		TotalPending:  totalPending,
		TotalApproved: totalApproved,
		TotalRejected: totalRejected,
	}, nil
}

func (s *BorrowService) GetCardDataByUser(ctx context.Context, currentUser model.User) (dto.BorrowCardResponse, error) {
	totalPending, err := s.repo.CountByStatusAndUserID(ctx, model.BorrowStatusPending, currentUser.ID)
	if err != nil {
		return dto.BorrowCardResponse{}, err
	}

	totalApproved, err := s.repo.CountByStatusAndUserID(ctx, model.BorrowStatusApproved, currentUser.ID)
	if err != nil {
		return dto.BorrowCardResponse{}, err
	}

	totalRejected, err := s.repo.CountByStatusAndUserID(ctx, model.BorrowStatusRejected, currentUser.ID)
	if err != nil {
		return dto.BorrowCardResponse{}, err
	}

	return dto.BorrowCardResponse{
		TotalPending:  totalPending,
		TotalApproved: totalApproved,
		TotalRejected: totalRejected,
	}, nil
}

func (s *BorrowService) Create(ctx context.Context, currentUser model.User, req dto.BorrowRequest) (dto.BorrowResponse, error) {
	var createdBorrow *model.Borrow

	now := time.Now().Truncate(24 * time.Hour)
	if req.BorrowDate.Before(now) {
		return dto.BorrowResponse{}, errors.BadRequest("Borrow date cannot be in the past")
	}
	if !req.ReturnDate.After(req.BorrowDate.Time) {
		return dto.BorrowResponse{}, errors.BadRequest("Return date must be after borrow date")
	}

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		item, err := txItemRepo.FindByID(ctx, req.ItemID)
		if err != nil {
			return err
		}
		if item == nil {
			return errors.NotFound(fmt.Sprintf("Item not found with ID: %d", req.ItemID))
		}

		if item.Quantity < req.Quantity {
			return errors.BadRequest("Item does not have enough quantity")
		}

		borrow := mapper.ToBorrowModel(req, currentUser, *item)
		if err := txBorrowRepo.Create(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "CREATE_BORROW")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		createdBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(createdBorrow), nil
}

func (s *BorrowService) CreateForUser(ctx context.Context, currentUser model.User, req dto.BorrowForUserRequest) (dto.BorrowResponse, error) {
	var createdBorrow *model.Borrow

	now := time.Now().Truncate(24 * time.Hour)
	if req.BorrowDate.Before(now) {
		return dto.BorrowResponse{}, errors.BadRequest("Borrow date cannot be in the past")
	}
	if !req.ReturnDate.After(req.BorrowDate.Time) {
		return dto.BorrowResponse{}, errors.BadRequest("Return date must be after borrow date")
	}

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txUserRepo := s.userRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		user, err := txUserRepo.GetByID(ctx, req.UserID)
		if user == nil {
			return errors.NotFound(fmt.Sprintf("User not found with ID: %d", req.UserID))
		}
		if err != nil {
			return err
		}

		item, err := txItemRepo.FindByID(ctx, req.ItemID)
		if item == nil {
			return errors.NotFound(fmt.Sprintf("Item not found with ID: %d", req.ItemID))
		}
		if err != nil {
			return err
		}

		if item.Quantity < req.Quantity {
			return errors.BadRequest("Item does not have enough quantity")
		}

		borrow := mapper.ToBorrowModelForUser(req, *user, *item)
		if err := txBorrowRepo.Create(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "CREATE_BORROW")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		createdBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(createdBorrow), nil
}

func (s *BorrowService) UpdateForUser(ctx context.Context, req dto.BorrowRequest, id uint, currentUser model.User) (dto.BorrowResponse, error) {
	var updatedBorrow *model.Borrow

	now := time.Now().Truncate(24 * time.Hour)
	if req.BorrowDate.Before(now) {
		return dto.BorrowResponse{}, errors.BadRequest("Borrow date cannot be in the past")
	}
	if !req.ReturnDate.After(req.BorrowDate.Time) {
		return dto.BorrowResponse{}, errors.BadRequest("Return date must be after borrow date")
	}

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.FindByID(ctx, id)
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}
		if err != nil {
			return err
		}

		if borrow.Status != model.BorrowStatusPending {
			return errors.BadRequest("Borrow status is not pending")
		}

		item := &borrow.Item
		if borrow.ItemID != req.ItemID {
			var err error
			item, err := txItemRepo.FindByID(ctx, req.ItemID)
			if item == nil {
				return errors.NotFound(fmt.Sprintf("Item not found with ID: %d", req.ItemID))
			}
			if err != nil {
				return err
			}
		}

		if item.Quantity < req.Quantity {
			return errors.BadRequest("Item does not have enough quantity")
		}

		mapper.UpdateBorrowModel(borrow, req, *item)
		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "UPDATE_BORROW")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		updatedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(updatedBorrow), nil
}

func (s *BorrowService) Approve(ctx context.Context, currentUser model.User, id uint, req dto.BorrowApprovalRequest) (dto.BorrowResponse, error) {
	var approvedBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}
		if borrow.Status != model.BorrowStatusPending {
			return errors.BadRequest("Borrow status is not pending")
		}

		item := &borrow.Item
		if item.Quantity < borrow.Quantity {
			return errors.BadRequest("Item does not have enough quantity")
		}

		now := time.Now()
		borrow.Status = model.BorrowStatusApproved
		borrow.ReviewedUserID = &currentUser.ID
		borrow.ReviewedUser = &currentUser
		borrow.OfficerNote = req.OfficerNote
		borrow.ReviewAt = &now

		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "APPROVE_BORROW")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		approvedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(approvedBorrow), nil
}

func (s *BorrowService) Reject(ctx context.Context, currentUser model.User, id uint, req dto.BorrowApprovalRequest) (dto.BorrowResponse, error) {
	var rejectedBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}

		if borrow.Status != model.BorrowStatusPending {
			return errors.BadRequest("Borrow status is not pending")
		}

		now := time.Now()
		borrow.Status = model.BorrowStatusRejected
		borrow.ReviewedUserID = &currentUser.ID
		borrow.ReviewedUser = &currentUser
		borrow.OfficerNote = req.OfficerNote
		borrow.ReviewAt = &now

		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "REJECT_BORROW")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		rejectedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(rejectedBorrow), nil
}

func (s *BorrowService) Cancel(ctx context.Context, currentUser model.User, id uint) (dto.BorrowResponse, error) {
	var canceledBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}

		if borrow.Status != model.BorrowStatusPending {
			return errors.BadRequest("Borrow status is not pending")
		}

		borrow.Status = model.BorrowStatusCanceled

		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "CANCEL_BORROW")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		canceledBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(canceledBorrow), nil
}

func (s *BorrowService) Confirm(ctx context.Context, currentUser model.User, id uint) (dto.BorrowResponse, error) {
	var borrowedBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}

		if borrow.Status != model.BorrowStatusApproved {
			return errors.BadRequest("Borrow status is not approved")
		}

		item := &borrow.Item
		if item.Quantity < borrow.Quantity {
			return errors.BadRequest("Item does not have enough quantity")
		}

		item.Quantity -= borrow.Quantity
		if item.Quantity <= 0 {
			item.Status = model.ItemStatusUnavailable
		} else {
			item.Status = model.ItemStatusAvailable
		}

		if err := txItemRepo.Update(ctx, item); err != nil {
			return err
		}

		borrow.Status = model.BorrowStatusBorrowed
		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "BORROWED_BORROW")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		borrowedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(borrowedBorrow), nil
}

func (s *BorrowService) Return(ctx context.Context, currentUser model.User, id uint, req dto.ReturnRequest) (dto.BorrowResponse, error) {
	var returnedBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txReturnRepo := s.returnRepo.WithTx(tx)

		borrow, err := txBorrowRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}

		if borrow.Status != model.BorrowStatusBorrowed {
			return errors.BadRequest("Item is not being borrowed")
		}

		item := &borrow.Item
		item.Quantity += borrow.Quantity
		item.Status = model.ItemStatusAvailable

		if err := txItemRepo.Update(ctx, item); err != nil {
			return err
		}

		borrow.Status = model.BorrowStatusReturned
		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		var fine *float64
		now := time.Now().Truncate(24 * time.Hour)
		if now.After(borrow.ReturnDate) {
			diff := now.Sub(borrow.ReturnDate)
			diffOfDays := int(diff / (24 * time.Hour))
			fineAmount := float64(2000 * diffOfDays)
			fine = &fineAmount
		}

		returnBorrow := mapper.ToReturnModel(borrow, now, req, fine)
		if err := txReturnRepo.Create(ctx, returnBorrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "RETURN_BORROW")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		returnedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(returnedBorrow), nil
}

func (s *BorrowService) Delete(ctx context.Context, id uint, currentUser model.User) error {
	return s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.FindByID(ctx, id)
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}
		if err != nil {
			return err
		}

		if borrow.Status == model.BorrowStatusApproved ||
			borrow.Status == model.BorrowStatusBorrowed ||
			borrow.Status == model.BorrowStatusReturned {
			return errors.BadRequest("Only pending, rejected, and canceled borrow can be deleted")
		}

		if err := txBorrowRepo.Delete(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "DELETE_BORROW")
		return txLogRepo.Create(ctx, log)
	})
}

func (s *BorrowService) GeneratePDF(ctx context.Context, req dto.BorrowQuery) ([]byte, error) {
	borrows, _, err := s.repo.FindAll(ctx, req)
	if err != nil {
		return nil, err
	}

	templ, err := template.New("report.html").Funcs(template.FuncMap{
		"Add": func(a, b int) int {
			return a + b
		},
	}).ParseFiles("template/report.html")
	if err != nil {
		return nil, err
	}

	var htmlBuf bytes.Buffer
	if err := templ.Execute(&htmlBuf, map[string]any{
		"Borrows": borrows,
		"Year":    time.Now().Year(),
	}); err != nil {
		return nil, err
	}

	pdfGen, err := wkhtmltopdf.NewPDFGenerator()
	if err != nil {
		return nil, err
	}

	pdfGen.Dpi.Set(300)
	pdfGen.Orientation.Set(wkhtmltopdf.OrientationPortrait)
	pdfGen.PageSize.Set(wkhtmltopdf.PageSizeA4)

	page := wkhtmltopdf.NewPageReader(bytes.NewReader(htmlBuf.Bytes()))
	pdfGen.AddPage(page)

	if err := pdfGen.Create(); err != nil {
		return nil, err
	}

	return pdfGen.Bytes(), nil
}
