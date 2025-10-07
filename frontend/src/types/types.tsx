// requestとresponseの型を指定するファイル

// POST /register
// 新規ユーザー登録時のリクエストボディ
export interface RegisterRequest {
  name: string;
  email: string;
  password_hash: string;
}
/**
 * POST /login
 * ログイン時のリクエストボディ
 */
export interface LoginRequest {
  name: string;
  email: string;
  password_hash: string;
}

/**
 * POST /company
 * 会社情報作成時のリクエストボディ
 */
export interface CreateCompanyRequest {
  name: string;
  credit_limit: number;
}

/**
 * POST /bill
 * 請求書作成時のリクエストボディ
 */
export interface CreateBillRequest {
  name: string;
  credit: number;
  credit_date: string; // "YYYY-MM-DD"
}



/**
 * 201 Created from POST /register
 * ユーザー登録成功時のレスポンス
 */
export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

/**
 * 200 OK from POST /login
 * ログイン成功時のレスポンス
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * 201 Created from POST /company
 * 会社情報作成成功時のレスポンス
 */
export interface CompanyResponse {
  id: number;
  name: string;
  credit_limit: number;
}

/**
 * 201 Created from GET /company
 * 会社名一覧取得成功時のレスポンス
 */
export interface CompanyNameResponse {
  names: string[];
}

/**
 * 201 Created from POST /bill
 * 請求書作成成功時のレスポンス
 */
export interface BillResponse {
  id: number;
  name: string;
  credit: number;
  credit_date: string; // "YYYY-MM-DD"
}

/**
 * 個別の請求書データを表す型
 */
export interface Bill {
  id: number;
  name: string;
  credit: number;
  credit_date: string; // "YYYY-MM-DD"
}

/**
 * 200 OK from GET /bills
 * 請求書一覧取得成功時のレスポンス
 */
export type BillsResponse = Bill[];


// =============================================
// エラーレスポンス (Error Responses)
// =============================================

/**
 * 汎用的なエラーレスポンスの基本形
 */
export interface ErrorResponse {
  error: string;
  message: string;
}

// 各HTTPステータスコードに対応する具体的なエラー型
// 中身は同じですが、型名でエラーの種類を判別しやすくなります。

/**
 * 400 Bad Request
 */
export type ValidationError = ErrorResponse;

/**
 * 401 Unauthorized
 */
export type UnauthorizedError = ErrorResponse;

/**
 * 403 Forbidden
 */
export type ForbiddenError = ErrorResponse;

/**
 * 404 Not Found
 */
export type NotFoundError = ErrorResponse;

/**
 * 409 Conflict
 */
export type ConflictError = ErrorResponse;

/**
 * 500 Internal Server Error
 */
export type InternalServerError = ErrorResponse;