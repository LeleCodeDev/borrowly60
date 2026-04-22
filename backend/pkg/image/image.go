// Package image
package image

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"slices"
	"strings"

	"github.com/google/uuid"
	"github.com/lelecodedev/borrowly/pkg/errors"
)

func SaveImage(basePath string, file *multipart.FileHeader) (*string, error) {
	if err := os.MkdirAll(basePath, os.ModePerm); err != nil {
		return nil, err
	}

	allowedExts := []string{"jpeg", "png", "jpg"}
	ext := filepath.Ext(file.Filename)
	if !slices.Contains(allowedExts, strings.TrimPrefix(ext, ".")) {
		return nil, errors.BadRequest(fmt.Sprintf("File must be: %v", strings.Join(allowedExts, ", ")))
	}

	filename := uuid.New().String() + ext
	path := filepath.Join(basePath, filename)

	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	dst, err := os.Create(path)
	if err != nil {
		return nil, err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return nil, err
	}
	return &path, nil
}

func DeleteImage(path string) {
	if path != "" {
		os.Remove(path)
	}
}
