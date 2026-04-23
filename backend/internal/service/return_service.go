// Package service
package service

import (
	"context"
	"fmt"
	"time"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/mapper"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/pkg/errors"
	"gorm.io/gorm"
)

type ReturnService struct {
	txManager  *repository.TxManager
	repo       *repository.ReturnRepository
	borrowRepo *repository.BorrowRepository
	itemRepo   *repository.ItemRepository
	logRepo    *repository.LogActivityRepository
}

func NewReturnService(
	txManager *repository.TxManager,
	repo *repository.ReturnRepository,
	borrowRepo *repository.BorrowRepository,
	itemRepo *repository.ItemRepository,
	logRepo *repository.LogActivityRepository,
) *ReturnService {
	return &ReturnService{
		txManager:  txManager,
		repo:       repo,
		borrowRepo: borrowRepo,
		itemRepo:   itemRepo,
		logRepo:    logRepo,
	}
}

func (s *ReturnService) GetAll(ctx context.Context, req dto.ReturnQuery) ([]dto.ReturnResponse, int64, error) {
	returns, total, err := s.repo.FindAll(ctx, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.ReturnResponse, 0, len(returns))

	for _, returnBorrow := range returns {
		responses = append(responses, mapper.ToReturnResponse(&returnBorrow))
	}

	return responses, total, nil
}

func (s *ReturnService) GetAllByUser(ctx context.Context, currentUser model.User, req dto.ReturnQuery) ([]dto.ReturnResponse, int64, error) {
	returns, total, err := s.repo.FindAllByUserID(ctx, currentUser.ID, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.ReturnResponse, 0, len(returns))

	for _, returnBorrow := range returns {
		responses = append(responses, mapper.ToReturnResponse(&returnBorrow))
	}

	return responses, total, nil
}

func (s *ReturnService) GetCardData(ctx context.Context) (dto.ReturnCardResponse, error) {
	totalReturn, err := s.repo.CountAll(ctx)
	if err != nil {
		return dto.ReturnCardResponse{}, err
	}

	totalOverdue, err := s.repo.CountAllIsOverdue(ctx)
	if err != nil {
		return dto.ReturnCardResponse{}, err
	}

	return dto.ReturnCardResponse{
		TotalReturn:  totalReturn,
		TotalOverdue: totalOverdue,
	}, nil
}

func (s *ReturnService) GetCardDataByUser(ctx context.Context, currentUser model.User) (dto.ReturnCardResponse, error) {
	totalReturn, err := s.repo.CountByUserID(ctx, currentUser.ID)
	if err != nil {
		return dto.ReturnCardResponse{}, err
	}

	totalOverdue, err := s.repo.CountAllIsOverdueByUserID(ctx, currentUser.ID)
	if err != nil {
		return dto.ReturnCardResponse{}, err
	}

	return dto.ReturnCardResponse{
		TotalReturn:  totalReturn,
		TotalOverdue: totalOverdue,
	}, nil
}

func (s *ReturnService) CreateForUser(ctx context.Context, currentUser model.User, req dto.ReturnCreateForUserRequest) (dto.ReturnResponse, error) {
	var createdReturn *model.Return

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txReturnRepo := s.repo.WithTx(tx)
		txBorrowRepo := s.borrowRepo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.FindByID(ctx, req.BorrowID)
		if borrow == nil {
			return errors.BadRequest(fmt.Sprintf("Borrow not found with ID: %d", req.BorrowID))
		}
		if err != nil {
			return err
		}

		if borrow.Status != model.BorrowStatusBorrowed {
			return errors.BadRequest("Item is not being borrowed")
		}

		item := &borrow.Item
		if item.ID > 0 {
			item.Quantity += borrow.Quantity
			item.Status = model.ItemStatusAvailable
			if err := txItemRepo.Update(ctx, item); err != nil {
				return err
			}
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

		returnBorrow := mapper.ToReturnModelForUser(borrow, now, req, fine)
		if err := txReturnRepo.Create(ctx, returnBorrow); err != nil {
			return err
		}

		createdReturn = returnBorrow

		log := mapper.ToLogActivityModel(currentUser, fmt.Sprintf("CREATE RETURN ITEM %v", returnBorrow.Borrow.Item.Name))
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		return nil
	}); err != nil {
		return dto.ReturnResponse{}, err
	}

	return mapper.ToReturnResponse(createdReturn), nil
}

func (s *ReturnService) UpdateForUser(ctx context.Context, id uint, currentUser model.User, req dto.ReturnUpdateForUserRequest) (dto.ReturnResponse, error) {
	var updatedReturn *model.Return

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txReturnRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		returnBorrow, err := txReturnRepo.FindByID(ctx, id)
		if returnBorrow == nil {
			return errors.BadRequest(fmt.Sprintf("Return not found with ID: %d", id))
		}
		if err != nil {
			return err
		}

		returnBorrow.ActualReturnDate = req.ActualReturnDate.Time
		if err := txReturnRepo.Update(ctx, returnBorrow); err != nil {
			return err
		}

		updatedReturn = returnBorrow

		log := mapper.ToLogActivityModel(currentUser, fmt.Sprintf("UPDATE RETURN ITEM %v", returnBorrow.Borrow.Item.Name))
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		return nil
	}); err != nil {
		return dto.ReturnResponse{}, err
	}

	return mapper.ToReturnResponse(updatedReturn), nil
}

func (s *ReturnService) Delete(ctx context.Context, id uint, currentUser model.User) error {
	return s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txReturnRepo := s.repo.WithTx(tx)
		txBorrowRepo := s.borrowRepo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		returnBorrow, err := txReturnRepo.FindByID(ctx, id)
		if returnBorrow == nil {
			return errors.BadRequest(fmt.Sprintf("Return not found with ID: %d", id))
		}
		if err != nil {
			return err
		}

		borrow := &returnBorrow.Borrow
		item := &borrow.Item

		if item.ID > 0 {
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
		}

		borrow.Status = model.BorrowStatusBorrowed
		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		if err := txReturnRepo.Delete(ctx, returnBorrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, fmt.Sprintf("DELETE RETURN ITEM %v", returnBorrow.Borrow.Item.Name))
		return txLogRepo.Create(ctx, log)
	})
}
