package main

import (
    "context"
    "fmt"
    "log"
    "os"
    "net/http"
    "github.com/dann3256/due-log/backend/internal/infrastructure/db/sqlc"
    "github.com/dann3256/due-log/backend/internal/transport/http/ogen"
    user_handler "github.com/dann3256/due-log/backend/internal/user/handler"
    user_uc "github.com/dann3256/due-log/backend/internal/user/usecase"
    user_repo "github.com/dann3256/due-log/backend/internal/user/repository"

    company_handler "github.com/dann3256/due-log/backend/internal/company/handler"
    company_uc "github.com/dann3256/due-log/backend/internal/company/usecase"
    company_repo "github.com/dann3256/due-log/backend/internal/company/repository"

    "github.com/jackc/pgx/v5/pgxpool"
     _"github.com/lib/pq" // PostgreSQLドライバ
     _"github.com/golang-jwt/jwt/v5"
    "github.com/dann3256/due-log/backend/pkg/jwt"
    "github.com/golang-migrate/migrate/v4"
     _ "github.com/golang-migrate/migrate/v4/database/postgres" // PostgreSQL用のドライバ
     _ "github.com/golang-migrate/migrate/v4/source/file"       // ファイルからマイグレーションを読み込むためのドライバ
)

// 統合ハンドラー インターフェースを完全に実装
type RootHandler struct {
	userHandler    *user_handler.UserHandler
	companyHandler *company_handler.CompanyHandler
}

// RootHandler - 統合ハンドラーのコンストラクタ
func NewAPIHandler(userHandler *user_handler.UserHandler, companyHandler *company_handler.CompanyHandler) *RootHandler {
	return &RootHandler{
		userHandler:    userHandler,
		companyHandler: companyHandler,
	}
}
func (h *RootHandler) RegisterUser(ctx context.Context, req *openapi.RegisterUserReq) (openapi.RegisterUserRes, error) {
	return h.userHandler.RegisterUser(ctx, req)
}

func (h *RootHandler) Login(ctx context.Context, req *openapi.LoginReq) (openapi.LoginRes, error) {
	return h.userHandler.Login(ctx, req)
}

// Company関連のメソッドを統合ハンドラーに委譲
func (h *RootHandler) CreateCompany(ctx context.Context, req *openapi.CreateCompanyReq) (openapi.CreateCompanyRes, error) {
	return h.companyHandler.CreateCompany(ctx, req)
}
// HandleBearerAuth は Bearer トークン認証を処理する



func main() {
    // データベース接続情報
    //dsn := "postgres://user:password@db:5432/iizukaeats_db?sslmode=disable"

    dsn := os.Getenv("DB_SOURCE")
    if dsn == "" {
        log.Fatal("DB_SOURCE environment variable not set")
    }


    log.Println("データベースマイグレーションを開始します...")
    m, err := migrate.New(
        "file://./db/migrations", // ← typoを修正し、Docker内のパスに合わせる
        dsn,
    )
    if err != nil {
        log.Fatalf("マイグレーションの初期化に失敗しました: %v", err)
    }

    // マイグレーションを適用
    if err := m.Up(); err != nil {
        // ErrNoChangeは「既にデータベースが最新で変更がない」という正常なエラーなので、それ以外の場合のみエラーとする
        if err != migrate.ErrNoChange {
            log.Fatalf("マイグレーションの適用に失敗しました: %v", err)
        }
        log.Println("データベースは既に最新です。")
    } else {
        log.Println("データベースマイグレーションが正常に完了しました。")
    }

    // データベース接続 (マイグレーションが完了した後に行う)
    dbpool, err := pgxpool.New(context.Background(), dsn)
    if err != nil {
        log.Fatalf("DB接続失敗: %v", err)
    }
    defer dbpool.Close()

    jwtSecret := os.Getenv("JWT_SECRET_KEY")
    if jwtSecret == "" {
        log.Fatal("JWT_SECRET_KEY environment variable not set")
    }

    jwtManager, err := jwt.NewManager(jwtSecret)
    if err != nil {
        log.Fatalf("Failed to create JWT Manager: %v", err)
    }
    // 各レイヤーを作成
    queries := sqlc.New(dbpool)
    
    // User関連
    userRepo := user_repo.NewRepository(queries)
    userUsecase := user_uc.NewUsecase(userRepo, jwtManager)
    userHandler := user_handler.NewAPIHandler(userUsecase) // 具体的な型を返す

    // Company関連
    companyRepo := company_repo.NewCompanyRepository(queries)
    companyUsecase := company_uc.NewUsecase(companyRepo)
    companyHandler := company_handler.NewAPIHandler(companyUsecase) // 具体的な型を返す

    // 統合ハンドラーを作成
    apiHandler := NewAPIHandler(userHandler, companyHandler)



    srv, err := openapi.NewServer(apiHandler)
    if err != nil {
     log.Fatalf("サーバー作成失敗: %v", err)
    }

    // HTTPサーバー起動
    port := 8080
    log.Printf("サーバー起動 http://localhost:%d", port)
    if err := http.ListenAndServe(fmt.Sprintf(":%d", port), srv); err != nil {
    log.Fatalf("サーバー起動失敗: %v", err)
   }
}