// Package service
package service

import (
	"context"
	"fmt"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/mapper"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/pkg/errors"
	"gorm.io/gorm"
)

type CategoryService struct {
	txManager  *repository.TxManager
	repo       *repository.CategoryRepository
	itemRepo   *repository.ItemRepository
	borrowRepo *repository.BorrowRepository
	logRepo    *repository.LogActivityRepository
}

func NewCategoryService(
	txManager *repository.TxManager,
	repo *repository.CategoryRepository,
	itemRepo *repository.ItemRepository,
	borrowRepo *repository.BorrowRepository,
	logRepo *repository.LogActivityRepository,
) *CategoryService {
	return &CategoryService{
		txManager:  txManager,
		repo:       repo,
		itemRepo:   itemRepo,
		borrowRepo: borrowRepo,
		logRepo:    logRepo,
	}
}

func (s *CategoryService) GetAll(ctx context.Context, req dto.CategoryQuery) ([]dto.CategoryResponse, int64, error) {
	categories, total, err := s.repo.FindAll(ctx, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.CategoryResponse, 0, len(categories))

	for _, category := range categories {
		responses = append(responses, mapper.ToCategoryResponse(&category))
	}

	return responses, total, nil
}

func (s *CategoryService) GetByID(ctx context.Context, id uint) (dto.CategoryResponse, error) {
	category, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return dto.CategoryResponse{}, err
	}

	if category == nil {
		return dto.CategoryResponse{}, errors.NotFound(fmt.Sprintf("Category not found with ID: %d", id))
	}

	return mapper.ToCategoryResponse(category), nil
}

func (s *CategoryService) Create(ctx context.Context, currentUser model.User, req dto.CategoryRequest) (dto.CategoryResponse, error) {
	var createdCategory *model.Category

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		exist, err := txRepo.ExistByName(ctx, req.Name)
		if err != nil {

			fmt.Println("Error in repo get")
			return err
		}
		if exist {
			return errors.AlreadyExist("Category name already exist")
		}

		category := mapper.ToCategoryModel(req)
		if err := txRepo.Create(ctx, category); err != nil {
			fmt.Println("Error in repo create")
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, fmt.Sprintf("CREATE CATEGORY %v", category.Name))

		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		createdCategory = category

		return nil
	}); err != nil {
		return dto.CategoryResponse{}, err
	}

	return mapper.ToCategoryResponse(createdCategory), nil
}

func (s *CategoryService) Update(ctx context.Context, id uint, currentUser model.User, req dto.CategoryRequest) (dto.CategoryResponse, error) {
	var Updatedcategory *model.Category

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		category, err := txRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if category == nil {
			return errors.NotFound(fmt.Sprintf("Category not found with ID: %d", id))
		}

		if category.Name != req.Name {
			exist, err := txRepo.ExistByName(ctx, req.Name)
			if err != nil {
				return err
			}
			if exist {
				return errors.AlreadyExist("Category name already exist")
			}
		}

		mapper.UpdateCategoryModel(category, req)

		if err := txRepo.Update(ctx, category); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, fmt.Sprintf("UPDATE CATEGORY %v", category.Name))

		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		Updatedcategory = category

		return nil
	}); err != nil {
		return dto.CategoryResponse{}, err
	}

	return mapper.ToCategoryResponse(Updatedcategory), nil
}

func (s *CategoryService) Delete(ctx context.Context, currentUser model.User, id uint) error {
	return s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txCategoryRepo := s.repo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txBorrowRepo := s.borrowRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		category, err := txCategoryRepo.FindByID(ctx, id)
		if err != nil {
			return err
		}
		if category == nil {
			return errors.NotFound(fmt.Sprintf("Category not found with ID: %d", id))
		}

		exist, err := txBorrowRepo.ExistActiveByItemCategoryID(ctx, id)
		if err != nil {
			return err
		}
		if exist {
			return errors.Conflict("Cannot delete category with items that are currently being borrowed")
		}

		if err := txItemRepo.DeleteByCategoryID(ctx, id); err != nil {
			return err
		}

		if err := txCategoryRepo.Delete(ctx, category); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, fmt.Sprintf("DELETE CATEGORY %v", category.Name))
		return txLogRepo.Create(ctx, log)
	})
}
