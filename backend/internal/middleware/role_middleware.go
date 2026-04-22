package middleware

import (
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/pkg/response"
)

func RoleMiddleware(roles ...model.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(model.User)
		if slices.Contains(roles, user.Role) {
			c.Next()
			return
		}

		response.Error(c, http.StatusForbidden, "Access Denied", nil)
		c.Abort()
	}
}
