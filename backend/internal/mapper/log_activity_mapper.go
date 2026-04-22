package mapper

import (
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToLogActivityModel(user model.User, activity string) *model.LogActivity {
	return &model.LogActivity{
		UserID:   &user.ID,
		User:     &user,
		Activity: activity,
	}
}

func ToLogRespnse(log *model.LogActivity) dto.LogResponse {
	var user *dto.UserResponse
	if log.User != nil {
		userResponse := ToUserResponse(log.User)
		user = &userResponse
	}

	return dto.LogResponse{
		ID:        log.ID,
		User:      user,
		Activity:  log.Activity,
		CreatedAt: log.CreatedAt,
	}
}
