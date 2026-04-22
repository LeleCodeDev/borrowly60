package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/pkg/jwt"
	"github.com/lelecodedev/borrowly/pkg/response"
)

func extractToken(c *gin.Context) *string {
	bearerToken := c.GetHeader("Authorization")
	if token, ok := strings.CutPrefix(bearerToken, "Bearer "); ok {
		return &token
	}
	return nil
}

func AuthMiddleware(userRepo *repository.UserRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := extractToken(c)

		if tokenString == nil {
			response.Error(c, http.StatusUnauthorized, "Authorization header is required", nil)
			c.Abort()
			return
		}

		claims, err := jwt.ExtractToken(*tokenString)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "invalid token", nil)
			c.Abort()
			return
		}

		userId, err := jwt.ExtractUserID(claims)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "invalid token", nil)
			c.Abort()
			return
		}

		ctx := c.Request.Context()
		user, err := userRepo.FindByID(ctx, userId)
		if err != nil {
			response.Error(c, http.StatusInternalServerError, "Server errors", nil)
			c.Abort()
			return
		}
		if user == nil {
			response.Error(c, http.StatusNotFound, "User not found", nil)
			c.Abort()
			return
		}

		c.Set("user", *user)
		c.Next()
	}
}
