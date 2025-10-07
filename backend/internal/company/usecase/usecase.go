package usecase

import(
"context"

 "github.com/dann3256/due-log/backend/internal/company/repository"

 "github.com/dann3256/due-log/backend/internal/company/domain"
)

type Usecase interface{
 CreateCompany(ctx context.Context, req *CreateCompanyInputDTO) (*CreateCompanyOutputDTO, error)

 GetName(ctx context.Context) ([]*GetCompanyNameOutputDTO, error)
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
  ID int32
  Name string
  CreditLimit int32
}


type GetCompanyNameOutputDTO struct{
  Name string
}



func (u *usecaseImpl) CreateCompany(ctx context.Context, req *CreateCompanyInputDTO) (*CreateCompanyOutputDTO, error){

  params :=&domain.Company{
  Name:req.Name,
  CreditLimit:req.CreditLimit,
  }


 domainCompany,err:=u.repo.CreateCompany(ctx,params)
  if err != nil{
  return nil,err
  }

 createCompany :=&CreateCompanyOutputDTO{
   ID: domainCompany.ID,
  Name: domainCompany.Name,
  CreditLimit: domainCompany.CreditLimit,
  }

  return createCompany,nil

}



func(u *usecaseImpl) GetName(ctx context.Context) ([]*GetCompanyNameOutputDTO, error) {
    companyNames, err := u.repo.GetName(ctx)
    if err != nil {
        return nil, err
    }

    outputDTOs := make([]*GetCompanyNameOutputDTO, len(companyNames))
    for i, name := range companyNames {
        outputDTOs[i] = &GetCompanyNameOutputDTO{Name: name}
    }
    return outputDTOs, nil
}