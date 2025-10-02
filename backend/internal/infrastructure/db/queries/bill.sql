-- name: CreateBill :one
INSERT INTO bill (name,credit,credit_date )
VALUES ($1, $2, $3) 
RETURNING *;

-- name: GetBillByDate :many
SELECT id,name,credit,credit_date
FROM bill
WHERE credit_date = $1;