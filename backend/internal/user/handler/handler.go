package handler

import (
    "context"
    "github.com/dann3256/due-log/backend/internal/transport/http/ogen"
    "github.com/dann3256/due-log/backend/internal/user/usecase"
    
)

type UserHandler struct {
    uc usecase.Usecase
}

func NewAPIHandler(uc usecase.Usecase) *UserHandler {
    return &UserHandler{uc: uc}
}

// ==================================================メソッド実装===============================================

//  /register のリクエストを処理する
func (h *UserHandler) RegisterUser(ctx context.Context, req *openapi.RegisterUserReq) (openapi.RegisterUserRes, error) {

    // 1. リクエストをDTOに変換
    registerdto := &usecase.CreateUserInputDTO{
        Name:     string(req.Name),
        Email:    string(req.Email),
        Password: string(req.PasswordHash),
    }

    // Usecaseを呼び出す
    dtoUser, err := h.uc.RegisterUser(ctx, registerdto)
    if err != nil {
        return nil, err
    }

     // domain.User -> openapi.User (レスポンス用) への変換
   response := &openapi.UserResponse{
    ID:    openapi.ID(dtoUser.ID),
    Name:  openapi.Name(dtoUser.Name),
    Email: openapi.Email(dtoUser.Email),
   }
    return response, nil
}


//  /login のリクエストを処理する
func (h *UserHandler) Login(ctx context.Context, req *openapi.LoginReq) (openapi.LoginRes, error) {
    
    // 1. リクエストをDTOに変換
    logindto := &usecase.LoginInputDTO{
        Email:    string(req.Email),
        Password: string(req.PasswordHash),
    }

    // 必要に応じてデータを取得してレスポンスを構築
    loginRes, err := h.uc.Login(ctx, logindto)
	if err != nil {
		return nil,err
	}

	response := &openapi.LoginResponse{
        AccessToken: loginRes.AccessToken,
        RefreshToken: loginRes.RefreshToken,
   }
    return response, nil
}
