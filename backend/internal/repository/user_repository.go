package repository

import (
	"context"
	"errors"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) WithTx(tx *gorm.DB) *UserRepository {
	return &UserRepository{db: tx}
}

func (r *UserRepository) Create(ctx context.Context, user *model.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *UserRepository) Update(ctx context.Context, user *model.User) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *UserRepository) FindByID(ctx context.Context, id uint) (*model.User, error) {
	var user model.User

	if err := r.db.WithContext(ctx).First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User

	if err := r.db.WithContext(ctx).First(&user).Where("email = ?", email).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) ExistByEmail(ctx context.Context, email string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.User{}).Where("email = ?", email).Count(&count).Error
	return count > 1, err
}

func (r *UserRepository) GetAll(ctx context.Context, req dto.UserQuery) ([]model.User, int64, error) {
	var users []model.User
	var total int64

	db := r.db.WithContext(ctx).Model(&model.User{})

	db = db.Where("role != ?", "admin")

	if req.Search != "" {
		db = db.Where("username LIKE ? OR email LIKE ?", "%"+req.Search+"%", "%"+req.Search+"%")
	}

	if req.Role != "" {
		db = db.Where("role = ?", req.Role)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(string(req.OrderBy) + " " + string(req.Order))

	if !req.Unpage {
		db = db.Offset(req.GetOffset()).Limit(req.Size)
	}

	if err := db.Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id int) (*model.User, error) {
	var user model.User

	if err := r.db.WithContext(ctx).First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) Delete(ctx context.Context, user *model.User) error {
	return r.db.WithContext(ctx).Delete(user).Error
}

func (r *UserRepository) CountAll(ctx context.Context) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&model.User{}).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *UserRepository) CountByRole(ctx context.Context, role model.UserRole) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).
		Model(&model.User{}).
		Where("role = ?", role).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}
