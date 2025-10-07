package domain

import(
"time"
)

type BillInput struct {
	Name        string
	Credit      int32
	CreditDate  time.Time
}
type Bill struct {
	ID          int32
	Name        string
	Credit      int32
	CreditDate  time.Time
}

