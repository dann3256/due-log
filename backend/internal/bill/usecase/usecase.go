package usecase
import(
"context"
"time"
 "github.com/dann3256/due-log/backend/internal/bill/repository"
 "github.com/dann3256/due-log/backend/internal/bill/domain"
)
type Usecase interface{
 CreateBill(ctx context.Context, req *CreateBillInputDTO) (*CreateBillOutputDTO, error)
 GetBills(ctx context.Context, req *GetBillInputDTO) ([]*GetBillOutputDTO, error)
}
type usecaseImpl struct{
 repo repository.BillRepository
}
func NewUsecase(repo repository.BillRepository) Usecase{
		 return &usecaseImpl{repo:repo}
}
// Usecase層を疎結合（そけつごう）にする
// DTOは Data Transfer Object	
type CreateBillInputDTO struct{
	Name string
	Credit int32
	CreditDate  time.Time
}

type CreateBillOutputDTO struct{
	  ID int32
	  Name string
	  Credit int32
	  CreditDate time.Time
}
func (u *usecaseImpl) CreateBill(ctx context.Context, req *CreateBillInputDTO) (*CreateBillOutputDTO, error){

  params :=&domain.BillInput{
	Name: req.Name,
	Credit: req.Credit,
	CreditDate: req.CreditDate,
  }
  bill,err := u.repo.CreateBill(ctx, params)
  if err != nil{
	return nil, err
  }

  return &CreateBillOutputDTO{
	ID: bill.ID,
	Name: bill.Name,
	Credit: bill.Credit,
	CreditDate: bill.CreditDate,
  }, nil
}	

type GetBillInputDTO struct{
	CreditDate time.Time
}


type GetBillOutputDTO struct{
	  ID int32
	  Name string
	  Credit int32
	  CreditDate time.Time
}

func (u *usecaseImpl) GetBills(ctx context.Context, req *GetBillInputDTO) ([]*GetBillOutputDTO, error){
	  bills, err := u.repo.GetBills(ctx, req.CreditDate)	
	  if err != nil{
		return nil, err
	  }

	  result := make([]*GetBillOutputDTO, 0, len(bills))
	  for _, b := range bills{
		result = append(result, &GetBillOutputDTO{
			ID: b.ID,
			Name: b.Name,
			Credit: b.Credit,
			CreditDate: b.CreditDate,
		})
	  }
	  return result, nil
}
