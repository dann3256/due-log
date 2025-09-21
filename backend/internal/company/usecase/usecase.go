package usecase
import(
	"context"
	"github.com/dann3256/due-log/backend/internal/company/repository"
	"github.com/dann3256/due-log/backend/internal/company/domain"
)
type Usecase interface{
	CreateCompany(ctx context.Context, req *CreateCompanyInputDTO) (*CreateCompanyOutputDTO, error)
}

type usecaseImpl struct{
	repo repository.CompanyRepository
}

func NewUsecase(repo repository.CompanyRepository) Usecase{
	return &usecaseImpl{repo:repo}
}

// Usecase層を疎結合（そけつごう）にする
// DTOは Data Transfer Object
type CreateCompanyInputDTO struct{
	Name string
	CreditLimit int32
}

type CreateCompanyOutputDTO struct{
   ID  int32
   Name string
   Creditlimit int32
}

func (u *usecaseImpl) CreateCompany(ctx context.Context, req *CreateCompanyInputDTO) (*CreateCompanyOutputDTO, error){
	params :=&domain.Company{
		Name:string(req.Name),
		Creditlimit:int32(req.CreditLimit),
	}
    
	domainCompany,err:=u.repo.CreateCompany(ctx,params)
	if err != nil{
		return nil,err
	}
	createCompany :=&CreateCompanyOutputDTO{
		ID:  domainCompany.ID,
        Name: domainCompany.Name,
        Creditlimit: domainCompany.Creditlimit,
	}
	return createCompany,nil
}



