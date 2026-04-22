// Package service
package service

import (
	"context"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/mapper"
	"github.com/lelecodedev/borrowly/internal/repository"
)

type LogService struct {
	repo *repository.LogActivityRepository
}

func NewLogService(repo *repository.LogActivityRepository) *LogService {
	return &LogService{repo: repo}
}

func (s *LogService) GetAll(ctx context.Context, req dto.LogQuery) ([]dto.LogResponse, int64, error) {
	logs, total, err := s.repo.FindAll(ctx, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.LogResponse, 0, len(logs))

	for _, log := range logs {
		responses = append(responses, mapper.ToLogRespnse(&log))
	}

	return responses, total, nil
}
