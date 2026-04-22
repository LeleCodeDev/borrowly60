package service

import (
	"context"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/mapper"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/pkg/errors"
	"github.com/lelecodedev/borrowly/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	txManager *repository.TxManager
	repo      *repository.UserRepository
}

func NewAuthService(
	txManager *repository.TxManager,
	repo *repository.UserRepository,
) *AuthService {
	return &AuthService{
		txManager: txManager,
		repo:      repo,
	}
}

func (s *AuthService) Register(ctx context.Context, req dto.RegisterRequest) (dto.AuthResponse, error) {
	var registeredUser *model.User

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txRepo := s.repo.WithTx(tx)

		exist, err := txRepo.ExistByEmail(ctx, req.Email)
		if err != nil {
			return err
		}
		if exist {
			return errors.AlreadyExist("Email already exist")
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		user := mapper.ToRegisterUserModel(req, string(hashedPassword))
		if err := txRepo.Create(ctx, user); err != nil {
			return err
		}

		registeredUser = user

		return nil
	}); err != nil {
		return dto.AuthResponse{}, err
	}

	token, err := jwt.GenerateToken(registeredUser.ID)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	return mapper.ToAuthResponse(registeredUser, token), nil
}

func (s *AuthService) Login(ctx context.Context, req dto.LoginRequest) (dto.AuthResponse, error) {
	user, err := s.repo.FindByEmail(ctx, req.Email)
	if user == nil {
		return dto.AuthResponse{}, errors.NotFound("Invalid email or password")
	}
	if err != nil {
		return dto.AuthResponse{}, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return dto.AuthResponse{}, errors.Unauthorized("Invalid email or password")
	}

	token, err := jwt.GenerateToken(user.ID)
	if err != nil {
		return dto.AuthResponse{}, err
	}

	return mapper.ToAuthResponse(user, token), nil
}

func (s *AuthService) GetProfile(currentUser model.User) dto.UserResponse {
	user := mapper.ToUserResponse(&currentUser)
	return user
}
