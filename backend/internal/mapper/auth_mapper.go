package mapper

import (
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToAuthResponse(user *model.User, token string) dto.AuthResponse {
	return dto.AuthResponse{
		User:  ToUserResponse(user),
		Token: token,
	}
}
