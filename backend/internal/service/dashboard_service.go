package service

import (
	"context"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/repository"
)

type DashboardService struct {
	itemRepo     *repository.ItemRepository
	categoryRepo *repository.CategoryRepository
	userRepo     *repository.UserRepository
	borrowRepo   *repository.BorrowRepository
	returnRepo   *repository.ReturnRepository
}

func NewDashboardService(
	itemRepo *repository.ItemRepository,
	categoryRepo *repository.CategoryRepository,
	userRepo *repository.UserRepository,
	borrowRepo *repository.BorrowRepository,
	returnRepo *repository.ReturnRepository,
) *DashboardService {
	return &DashboardService{
		itemRepo:     itemRepo,
		categoryRepo: categoryRepo,
		userRepo:     userRepo,
		borrowRepo:   borrowRepo,
		returnRepo:   returnRepo,
	}
}

func (s *DashboardService) GetAdminDashboard(ctx context.Context) (dto.AdminDashbordResponse, error) {
	totalItems, err := s.itemRepo.CountAll(ctx)
	if err != nil {
		return dto.AdminDashbordResponse{}, err
	}

	totalCategories, err := s.categoryRepo.CountAll(ctx)
	if err != nil {
		return dto.AdminDashbordResponse{}, err
	}

	totalUsers, err := s.userRepo.CountAll(ctx)
	if err != nil {
		return dto.AdminDashbordResponse{}, err
	}

	totalBorrows, err := s.borrowRepo.CountByStatus(ctx, model.BorrowStatusBorrowed)
	if err != nil {
		return dto.AdminDashbordResponse{}, err
	}

	return dto.AdminDashbordResponse{
		TotalItems:      totalItems,
		TotalCategories: totalCategories,
		TotalUsers:      totalUsers,
		TotalBorrows:    totalBorrows,
	}, nil
}

func (s *DashboardService) GetBorrowerDashboard(ctx context.Context, currentUser model.User) (dto.BorrowerDashbordResponse, error) {
	totalPending, err := s.borrowRepo.CountByStatusAndUserID(ctx, model.BorrowStatusPending, currentUser.ID)
	if err != nil {
		return dto.BorrowerDashbordResponse{}, err
	}

	totalBorrowed, err := s.borrowRepo.CountByStatusAndUserID(ctx, model.BorrowStatusApproved, currentUser.ID)
	if err != nil {
		return dto.BorrowerDashbordResponse{}, err
	}

	totalReturned, err := s.returnRepo.CountByUserID(ctx, currentUser.ID)
	if err != nil {
		return dto.BorrowerDashbordResponse{}, err
	}

	return dto.BorrowerDashbordResponse{
		TotalPending:  totalPending,
		TotalBorrowed: totalBorrowed,
		TotalReturned: totalReturned,
	}, nil
}

func (s *DashboardService) GetOfficerDashboard(ctx context.Context) (dto.OfficerDashbordResponse, error) {
	totalPending, err := s.borrowRepo.CountByStatus(ctx, model.BorrowStatusPending)
	if err != nil {
		return dto.OfficerDashbordResponse{}, err
	}

	totalBorrowed, err := s.borrowRepo.CountByStatus(ctx, model.BorrowStatusApproved)
	if err != nil {
		return dto.OfficerDashbordResponse{}, err
	}

	totalReturned, err := s.returnRepo.CountAll(ctx)
	if err != nil {
		return dto.OfficerDashbordResponse{}, err
	}

	totalItems, err := s.itemRepo.CountAll(ctx)
	if err != nil {
		return dto.OfficerDashbordResponse{}, err
	}

	return dto.OfficerDashbordResponse{
		TotalPending:  totalPending,
		TotalBorrowed: totalBorrowed,
		TotalReturned: totalReturned,
		TotalItems:    totalItems,
	}, nil
}
