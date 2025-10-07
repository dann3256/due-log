// APIラッパー関数（UIとエンドポイントの機能を結び付ける関数）

import apiClient from './apiClient';
import type { 
  RegisterRequest, 
  UserResponse, 
  LoginRequest, 
  LoginResponse ,
  CreateCompanyRequest,
  CompanyResponse,
  CompanyNameResponse,
  CreateBillRequest,
  BillResponse,
  BillsResponse
} from '../types/types.tsx';

/**
 * 新規ユーザー登録を行う
 */
export const registerUser = async (data: RegisterRequest): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/register', data);
  return response.data;
};

/**
 * ログイン処理を行う
 */
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', data);
  return response.data;
};

export const createCompany = async (data: CreateCompanyRequest): Promise<CompanyResponse> => {
  // ブラウザのlocalStorageからアクセストークンを取得
  const token = localStorage.getItem('accessToken');

  // トークンが存在しない場合はエラーを投げる
  if (!token) {
    throw new Error('認証トークンが見つかりません。ログインしてください。');
  }

  // APIリクエストを実行
  // 第3引数でリクエストごとの設定を渡せる
  const response = await apiClient.post<CompanyResponse>('/company', data, {
    // headersにAuthorization情報を追加して送信
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
};

/**
 * 登録されている会社名の一覧を取得する (認証が必要)
 */
export const getCompanyNames = async (): Promise<CompanyNameResponse> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('認証トークンが見つかりません。');

  const response = await apiClient.get<CompanyNameResponse>('/company', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

/**
 * 新しい請求書を作成する (認証が必要)
 */
export const createBill = async (data: CreateBillRequest): Promise<BillResponse> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('認証トークンが見つかりません。');

  const response = await apiClient.post<BillResponse>('/bill', data, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

/**
 * 指定した日付の請求書一覧を取得する (認証が必要)
 */
export const getBillsByDate = async (date: string): Promise<BillsResponse> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('認証トークンが見つかりません。');

  const response = await apiClient.get<BillsResponse>('/bills', {
    headers: { 'Authorization': `Bearer ${token}` },
    // クエリパラメータとして日付を渡す
    params: {
      credit_date: date
    }
  });
  return response.data;
};