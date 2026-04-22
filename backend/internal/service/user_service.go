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
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	txManager *repository.TxManager
	repo      *repository.UserRepository
	logRepo   *repository.LogActivityRepository
}

func NewUserService(txManager *repository.TxManager,
	repo *repository.UserRepository,
	logRepo *repository.LogActivityRepository,
) *UserService {
	return &UserService{
		txManager: txManager,
		repo:      repo,
		logRepo:   logRepo,
	}
}

func (s *UserService) GetAll(ctx context.Context, req dto.UserQuery) ([]dto.UserResponse, int64, error) {
	users, total, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.UserResponse, 0, len(users))

	for _, user := range users {
		responses = append(responses, mapper.ToUserResponse(&user))
	}

	return responses, total, nil
}

func (s *UserService) GetByID(ctx context.Context, id uint) (dto.UserResponse, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return dto.UserResponse{}, err
	}

	if user == nil {
		return dto.UserResponse{}, errors.NotFound(fmt.Sprintf("User not found with ID: %d", id))
	}

	return mapper.ToUserResponse(user), nil
}

func (s *UserService) GetCardData(ctx context.Context) (dto.UserCardResponse, error) {
	totalBorrowers, err := s.repo.CountByRole(ctx, model.RoleBorrower)
	if err != nil {
		return dto.UserCardResponse{}, err
	}

	totalOfficers, err := s.repo.CountByRole(ctx, model.RoleOfficer)
	if err != nil {
		return dto.UserCardResponse{}, err
	}

	return dto.UserCardResponse{TotalBorrowers: totalBorrowers, TotalOfficers: totalOfficers}, nil
}

func (s *UserService) Create(ctx context.Context, currentUser model.User, req dto.UserCreateRequest) (dto.UserResponse, error) {
	var createdUser *model.User

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txUserRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		exist, err := txUserRepo.ExistByEmail(ctx, req.Email)
		if err != nil {
			return err
		}
		if exist {
			return errors.AlreadyExist("User email already exist")
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		user := mapper.ToUserModel(req, string(hashedPassword))
		if err := txUserRepo.Create(ctx, user); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "CREATE_USER")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		createdUser = user

		return nil
	}); err != nil {
		return dto.UserResponse{}, err
	}

	return mapper.ToUserResponse(createdUser), nil
}

func (s *UserService) Update(ctx context.Context, id uint, currentUser model.User, req dto.UserUpdateRequest) (dto.UserResponse, error) {
	var updatedUser *model.User

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txUserRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		user, err := txUserRepo.GetByID(ctx, id)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.NotFound(fmt.Sprintf("User not found with ID: %d", id))
		}

		mapper.UpdateUserModel(user, req)

		if err := txUserRepo.Update(ctx, user); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, "UPDATE_USER")
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		updatedUser = user

		return nil
	}); err != nil {
		return dto.UserResponse{}, err
	}

	return mapper.ToUserResponse(updatedUser), nil
}

func (s *UserService) Delete(ctx context.Context, currentUser model.User, id uint) error {
	return s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txUserRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		user, err := txUserRepo.GetByID(ctx, id)
		if err != nil {
			return err
		}
		if user == nil {
			return errors.NotFound(fmt.Sprintf("User not found with ID: %d", id))
		}

		if err := txUserRepo.Delete(ctx, user); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser,"DELETE_USER")
		return txLogRepo.Create(ctx, log)
	})
}
