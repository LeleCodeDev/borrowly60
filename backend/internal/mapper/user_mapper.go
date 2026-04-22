package mapper

import (
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToRegisterUserModel(req dto.RegisterRequest, hashedPassword string) *model.User {
	return &model.User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
		Phone:    req.Phone,
		Role:     model.RoleBorrower,
	}
}

func ToUserModel(req dto.UserCreateRequest, hashedPassword string) *model.User {
	return &model.User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
		Phone:    req.Phone,
		Role:     req.Role,
	}
}

func ToUserResponse(user *model.User) dto.UserResponse {
	return dto.UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		Phone:     user.Phone,
		Role:      user.Role,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}

func UpdateUserModel(user *model.User, req dto.UserUpdateRequest) {
	user.Username = req.Username
	user.Phone = req.Phone
	user.Role = req.Role
}
