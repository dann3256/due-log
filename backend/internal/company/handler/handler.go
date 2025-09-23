package handler

import (
	"context"
	"log"

	"github.com/dann3256/due-log/backend/internal/company/usecase"
	openapi "github.com/dann3256/due-log/backend/internal/transport/http/ogen"
)

// モジュラーモノリスによって機能ごとにモジュール化するためのハンドラ（あくまで型）
type CompanyHandler struct {
	uc usecase.Usecase
}

// 依存の注入を行う
func NewAPIHandler(uc usecase.Usecase) *CompanyHandler {
	return &CompanyHandler{uc: uc}
}

func (h *CompanyHandler) CreateCompany(ctx context.Context, req *openapi.CreateCompanyReq) (openapi.CreateCompanyRes, error) {
	createdto := &usecase.CreateCompanyInputDTO{
		Name:        string(req.Name),
		CreditLimit: int32(req.CreditLimit),
	}
	dtoCompany, err := h.uc.CreateCompany(ctx, createdto)
	if err != nil {
		log.Printf("ERROR in RegisterUser: %v", err)
		return nil, err
	}

	response := &openapi.CompanyResponse{
		ID:          openapi.ID(dtoCompany.ID),
		Name:        openapi.Name(dtoCompany.Name),
		CreditLimit: openapi.CreditLimit(dtoCompany.Creditlimit),
	}
	return response, nil
}
