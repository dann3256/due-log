package repository

import (
	"context"
	"github.com/dann3256/due-log/backend/internal/company/domain"
	"github.com/dann3256/due-log/backend/internal/infrastructure/db/sqlc"
)

type CompanyRepository interface {
	CreateCompany(ctx context.Context, company *domain.Company) (*domain.Company, error)
	GetName(ctx context.Context) ([]string, error)
}

type CompanyRepositoryImpl struct {
	q  *sqlc.Queries
}

func NewCompanyRepository(q *sqlc.Queries) CompanyRepository {
	return &CompanyRepositoryImpl{q: q}
}

// ==================================================メソッド実装===============================================
func (r *CompanyRepositoryImpl) CreateCompany(ctx context.Context, company *domain.Company) (*domain.Company, error) {
	// domain.Company -> sqlc.CreateCompanyParams への変換
	params := sqlc.CreateCompanyParams{
		Name:        company.Name,
		CreditLimit: company.CreditLimit,
	}
	createdSQLCompany, err := r.q.CreateCompany(ctx, params)
	if err != nil {
		return nil, err
	}
	// sqlc.Company -> domain.Company への変換
	return &domain.Company{
		ID:          createdSQLCompany.ID,
		Name:        createdSQLCompany.Name,
		CreditLimit: createdSQLCompany.CreditLimit,
	}, nil
}

func(r *CompanyRepositoryImpl)GetName(ctx context.Context) ([]string, error) {
	getCompanyName, err := r.q.GetName(ctx)
	if err != nil {
		return nil, err
	}
	return getCompanyName, nil
}
