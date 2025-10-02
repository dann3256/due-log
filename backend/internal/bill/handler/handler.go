package handler
import(
	"context"
	"time"
	"github.com/dann3256/due-log/backend/internal/transport/http/ogen"
	"github.com/dann3256/due-log/backend/internal/bill/usecase"
)

type BillHandler struct{
	uc usecase.Usecase
}

func NewAPIHandler(uc usecase.Usecase) *BillHandler{
	return &BillHandler{uc: uc}
}

// ==================================================メソッド実装===============================================
func (h *BillHandler) CreateBill(ctx context.Context, req *openapi.CreateBillReq) (openapi.CreateBillRes, error){
	createdto :=&usecase.CreateBillInputDTO{
		Name:string(req.Name),
		Credit:int32(req.Credit),
		CreditDate:time.Time(req.CreditDate),
	}

	dtoBill,err :=h.uc.CreateBill(ctx, createdto)
	if err != nil{
		return nil,err
	}
	response := &openapi.BillResponse{
		ID:openapi.ID(dtoBill.ID),
		Name:openapi.Name(dtoBill.Name),
		Credit:openapi.Credit(dtoBill.Credit),
		CreditDate:openapi.CreditDate(dtoBill.CreditDate),
	}
	return response,nil
}




	
func (h *BillHandler) GetBills(ctx context.Context, params openapi.GetBillsParams) (openapi.GetBillsRes, error) {
	// 1. APIの型 (ogen) からGoの標準型 (time.Time) へ変換
	getdto := &usecase.GetBillInputDTO{
		CreditDate: time.Time(params.CreditDate),
	}

	// 2. Usecaseを呼び出す
	dtoBills, err := h.uc.GetBills(ctx, getdto)
	if err != nil {
		return &openapi.InternalServerError{}, err // エラーレスポンスを返す
	}

	// 3. UsecaseのDTOからAPIのレスポンス型 (ogen) へ詰め替える
	//    ※ ここではBillsがBillResponseと同じ構造だと仮定しています
	bills := make(openapi.GetBillsOKApplicationJSON, 0, len(dtoBills))
	for _, dto := range dtoBills {
		if dto != nil {
			bills = append(bills, openapi.Bills{ // Bills型に変換
				ID:         dto.ID,
				Name:       dto.Name,
				Credit:     dto.Credit,
				CreditDate: dto.CreditDate,
			})
		}
	}

	// 4. 正しい型でレスポンスを返す
	return &bills, nil
}