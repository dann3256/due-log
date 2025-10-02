package repository
import(
"context"
"time"
 "github.com/dann3256/due-log/backend/internal/bill/domain"
	
"github.com/dann3256/due-log/backend/internal/infrastructure/db/sqlc"
)
type BillRepository interface{
 CreateBill(ctx context.Context, bill *domain.BillInput) (*domain.Bill, error)
 GetBills(ctx context.Context, creditDate time.Time) ([]*domain.Bill, error)
}
type billRepositoryImpl struct{
	 db *sqlc.Queries
}
func NewRepository(db *sqlc.Queries) BillRepository{
	return &billRepositoryImpl{db:db}
}

func (r *billRepositoryImpl) CreateBill(ctx context.Context, bill *domain.BillInput) (*domain.Bill, error){
	  arg := sqlc.CreateBillParams{
		Name: bill.Name,
		Credit: bill.Credit,
		CreditDate: bill.CreditDate,
	  }
	  createdBill, err := r.db.CreateBill(ctx, arg)
	  if err != nil{
		return nil, err
	  }

	  return &domain.Bill{
		ID: createdBill.ID,
		Name: createdBill.Name,
		Credit: createdBill.Credit,
		CreditDate: createdBill.CreditDate,
	  }, nil
}

func (r *billRepositoryImpl) GetBills(ctx context.Context, creditDate time.Time) ([]*domain.Bill, error){
	bills, err := r.db.GetBillByDate(ctx, creditDate)
	if err != nil{
		return nil, err
	}
	result := make([]*domain.Bill, 0, len(bills))
	for _, b := range bills{

		result = append(result, &domain.Bill{
			ID: b.ID,
			Name: b.Name,
			Credit: b.Credit,
			CreditDate: b.CreditDate,
		})
	}
	return result, nil
}
