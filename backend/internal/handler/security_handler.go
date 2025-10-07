// internal/handler/security_handler.go

package handler

import (
	"context"
	"errors"
    "github.com/dann3256/due-log/backend/internal/transport/http/ogen"
	"github.com/dann3256/due-log/backend/pkg/jwt"
)

// ContextKey はコンテキストに値を設定する際のキーの型を定義します。
type ContextKey string

const (
	UserNameKey  ContextKey = "userName"
	UserEmailKey ContextKey = "userEmail"
)

// SecurityHandlerはJWTの検証ロ-ジックを保持します
type SecurityHandler struct {
	JwtManager *jwt.Manager
}

// NewSecurityHandler はコンストラクタです
func NewSecurityHandler(jwtManager *jwt.Manager) *SecurityHandler {
	return &SecurityHandler{JwtManager: jwtManager}
}

// HandleBearerAuth は ogen によって自動で呼び出されます
func (s *SecurityHandler) HandleBearerAuth(ctx context.Context, operationName string, t openapi.BearerAuth) (context.Context, error) {
	// 1. 先ほど作成したメソッドでトークンを検証し、クレームを取得
	claims, err := s.JwtManager.ValidateAccessToken(t.Token)
	if err != nil {
		// 検証失敗時、ogenが自動で401 Unauthorizedエラーを返す
		return nil, errors.New("invalid or expired token")
	}

	// 2. 検証成功後、ユーザー情報をコンテキストに詰めて後続の処理に渡す
	ctxWithUser := context.WithValue(ctx, UserNameKey, claims.Name)
	ctxWithUser = context.WithValue(ctxWithUser, UserEmailKey, claims.Email)

	return ctxWithUser, nil
}