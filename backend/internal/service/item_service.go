package service

import (
	"context"
	"fmt"
	"mime/multipart"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/mapper"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/pkg/errors"
	"github.com/lelecodedev/borrowly/pkg/image"
	"gorm.io/gorm"
)

type ItemService struct {
	txManager    *repository.TxManager
	repo         *repository.ItemRepository
	categoryRepo *repository.CategoryRepository
	borrowRepo   *repository.BorrowRepository
	logRepo      *repository.LogActivityRepository
}

func NewItemService(
	txManager *repository.TxManager,
	repo *repository.ItemRepository,
	categoryRepo *repository.CategoryRepository,
	logRepo *repository.LogActivityRepository,
) *ItemService {
	return &ItemService{
		txManager:    txManager,
		repo:         repo,
		categoryRepo: categoryRepo,
		logRepo:      logRepo,
	}
}

func (s *ItemService) GetAll(ctx context.Context, req dto.ItemQuery) ([]dto.ItemResponse, int64, error) {
	items, total, err := s.repo.FindAll(ctx, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.ItemResponse, 0, len(items))

	for _, item := range items {
		responses = append(responses, mapper.ToItemResponse(&item))
	}

	return responses, total, nil
}

func (s *ItemService) GetByID(ctx context.Context, id uint) (dto.ItemResponse, error) {
	item, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return dto.ItemResponse{}, err
	}

	if item == nil {
		return dto.ItemResponse{}, errors.NotFound(fmt.Sprintf("Item not found with ID: %d", id))
	}

	return mapper.ToItemResponse(item), nil
}

func (s *ItemService) GetCardData(ctx context.Context) (dto.ItemCardResponse, error) {
	availableItems, err := s.repo.CountByStatus(ctx, model.ItemStatusAvailable)
	if err != nil {
		return dto.ItemCardResponse{}, err
	}

	unavailableItems, err := s.repo.CountByStatus(ctx, model.ItemStatusUnavailable)
	if err != nil {
		return dto.ItemCardResponse{}, err
	}

	return dto.ItemCardResponse{AvailableItems: availableItems, UnavailableItems: unavailableItems}, nil
}

func (s *ItemService) Create(ctx context.Context, currentUser model.User, req dto.ItemCreateRequest, file *multipart.FileHeader) (dto.ItemResponse, error) {
	var createdItem *model.Item

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txItemRepo := s.repo.WithTx(tx)
		txCategoryRepo := s.categoryRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		exist, err := txItemRepo.ExistByName(ctx, req.Name)
		if err != nil {
			return err
		}
		if exist {
			return errors.AlreadyExist("Item name already exist")
		}

		category, err := txCategoryRepo.FindByID(ctx, req.CategoryID)
		if err != nil {
			return err
		}
		if category == nil {
			return errors.NotFound(fmt.Sprintf("Category not found with ID: %d", req.CategoryID))
		}

		var imagePath *string
		if file != nil {
			path, err := image.SaveImage("uploads/items", file)
			if err != nil {
				return err
			}

			imagePath = path
		}

		item := mapper.ToItemModel(req, *category, imagePath)
		if err := txItemRepo.Create(ctx, item); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "CREATE_ITEM")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		createdItem = item

		return nil
	}); err != nil {
		return dto.ItemResponse{}, err
	}

	return mapper.ToItemResponse(createdItem), nil
}

func (s *ItemService) Update(ctx context.Context, id uint, currentUser model.User, req dto.ItemUpdateRequest, file *multipart.FileHeader) (dto.ItemResponse, error) {
	var UpdatedItem *model.Item

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txItemRepo := s.repo.WithTx(tx)
		txCategoryRepo := s.categoryRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		item, err := txItemRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if item == nil {
			return errors.NotFound(fmt.Sprintf("Item not found with ID: %d", id))
		}

		if item.Name != req.Name {
			exist, err := txItemRepo.ExistByName(ctx, req.Name)
			if err != nil {
				return err
			}
			if exist {
				return errors.AlreadyExist("Item name already exist")
			}
		}

		category := &item.Category
		if item.CategoryID != req.CategoryID {
			var err error
			category, err = txCategoryRepo.FindByID(ctx, req.CategoryID)
			if err != nil {
				return err
			}
			if category == nil {
				return errors.NotFound(fmt.Sprintf("Category not found with ID: %d", req.CategoryID))
			}
		}

		status := model.ItemStatusAvailable
		if *req.Quantity < 1 {
			status = model.ItemStatusUnavailable
		}

		imagepath := item.Image
		if file != nil {
			if item.Image != nil {
				image.DeleteImage(*item.Image)
			}

			path, err := image.SaveImage("uploads/items", file)
			if err != nil {
				return err
			}

			imagepath = path
		}

		mapper.UpdateItemModel(item, req, status, *category, imagepath)

		if err := txItemRepo.Update(ctx, item); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "UPDATE_ITEM")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		UpdatedItem = item

		return nil
	}); err != nil {
		return dto.ItemResponse{}, err
	}

	return mapper.ToItemResponse(UpdatedItem), nil
}

func (s *ItemService) Delete(ctx context.Context, currentUser model.User, id uint) error {
	return s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txItemRepo := s.repo.WithTx(tx)
		txBorrowRepo := s.borrowRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		item, err := txItemRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if item == nil {
			return errors.NotFound(fmt.Sprintf("Item not found with ID: %d", id))
		}

		exist, err := txBorrowRepo.ExistActiveByItemID(ctx, id)
		if err != nil {
			return err
		}
		if exist {
			return errors.Conflict("Cannot delete item that are currently being borrowed")
		}

		if item.Image != nil {
			image.DeleteImage(*item.Image)
		}

		if err := txItemRepo.Delete(ctx, item); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "DELETE_ITEM")
		return txLogRepo.Create(ctx, log)
	})
}
