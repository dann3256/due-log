-- name: CreateCompany :one
INSERT INTO company (name, credit_limit)
VALUES ($1, $2) 
RETURNING *;

-- name: GetCompanyByName :one
SELECT id, name, credit_limit
FROM company
WHERE name = $1;

