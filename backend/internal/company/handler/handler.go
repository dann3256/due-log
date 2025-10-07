package handler

import(
	"context"
	"github.com/dann3256/due-log/backend/internal/transport/http/ogen"
    "github.com/dann3256/due-log/backend/internal/company/usecase"
)

// モジュラーモノリスによって機能ごとにモジュール化するためのハンドラ（あくまで型）
type CompanyHandler struct{
	uc usecase.Usecase
}
// 依存の注入を行う
func NewAPIHandler(uc usecase.Usecase) *CompanyHandler{
    return &CompanyHandler{uc: uc}
}

func (h *CompanyHandler)CreateCompany(ctx context.Context, req *openapi.CreateCompanyReq) (openapi.CreateCompanyRes, error){
	createdto :=&usecase.CreateCompanyInputDTO{
		Name:string(req.Name),
        CreditLimit:int32(req.CreditLimit),
	}
	dtoCompany,err :=h.uc.CreateCompany(ctx, createdto)
	if err != nil{
		return nil,err
	}

	response := &openapi.CompanyResponse{
		ID:openapi.ID(dtoCompany.ID),
		Name:openapi.Name(dtoCompany.Name),
		CreditLimit: openapi.CreditLimit(dtoCompany.CreditLimit),

	}
	return response,nil
}

func (h *CompanyHandler) GetCompanyName(ctx context.Context) (openapi.GetCompanyNameRes, error) {
	// 1. UseCaseから会社情報のDTOスライスを取得
	companyDTOs, err := h.uc.GetName(ctx)
	if err != nil {
		return nil, err
	}
	// 2. レスポンス用のスライスを初期化
	// var names []openapi.Name と同じ
	names := make([]openapi.Name, 0, len(companyDTOs))
	// 3. DTOスライスをループして、レスポンス用のnameスライスに変換・追加
	for _, dto := range companyDTOs {
		if dto != nil { // nilポインタでないことを確認
			names = append(names, openapi.Name(dto.Name))
		}
	}
	// 4. 変換したスライスを使って最終的なレスポンスオブジェクトを構築
	response := &openapi.CompanyNameResponse{
		Names: names,
	}

	return response, nil
}
