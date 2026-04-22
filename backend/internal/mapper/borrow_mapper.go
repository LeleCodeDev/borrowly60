package mapper

import (
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToBorrowResponse(borrow *model.Borrow) dto.BorrowResponse {
	var reviewUser *dto.UserResponse
	if borrow.ReviewedUser != nil {
		userResponse := ToUserResponse(borrow.ReviewedUser)
		reviewUser = &userResponse
	}

	var user *dto.UserResponse
	if borrow.User.ID != 0 {
		userResponse := ToUserResponse(&borrow.User)
		user = &userResponse
	}

	var item *dto.ItemResponse
	if borrow.Item.ID != 0 {
		itemResponse := ToItemResponse(&borrow.Item)
		item = &itemResponse
	}

	return dto.BorrowResponse{
		ID:           borrow.ID,
		User:         user,
		ReviewedUser: reviewUser,
		Item:         item,
		Purpose:      borrow.Purpose,
		Quantity:     borrow.Quantity,
		OfficerNote:  borrow.OfficerNote,
		BorrowDate:   borrow.BorrowDate,
		ReturnDate:   borrow.ReturnDate,
		Status:       borrow.Status,
		ReviewAt:     borrow.ReviewAt,
		CreatedAt:    borrow.CreatedAt,
		UpdatedAt:    borrow.UpdatedAt,
	}
}

func ToBorrowModel(req dto.BorrowRequest, user model.User, item model.Item) *model.Borrow {
	return &model.Borrow{
		UserID:     user.ID,
		User:       user,
		ItemID:     item.ID,
		Item:       item,
		Purpose:    req.Purpose,
		Quantity:   req.Quantity,
		BorrowDate: req.BorrowDate.Time,
		ReturnDate: req.ReturnDate.Time,
		Status:     model.BorrowStatusPending,
	}
}

func ToBorrowModelForUser(req dto.BorrowForUserRequest, user model.User, item model.Item) *model.Borrow {
	return &model.Borrow{
		UserID:     user.ID,
		User:       user,
		ItemID:     item.ID,
		Item:       item,
		Purpose:    req.Purpose,
		Quantity:   req.Quantity,
		BorrowDate: req.BorrowDate.Time,
		ReturnDate: req.ReturnDate.Time,
		Status:     model.BorrowStatusPending,
	}
}

func UpdateBorrowModel(borrow *model.Borrow, req dto.BorrowRequest, item model.Item) {
	borrow.ItemID = item.ID
	borrow.Item = item
	borrow.Quantity = req.Quantity
	borrow.Purpose = req.Purpose
	borrow.BorrowDate = req.BorrowDate.Time
	borrow.ReturnDate = req.ReturnDate.Time
}
